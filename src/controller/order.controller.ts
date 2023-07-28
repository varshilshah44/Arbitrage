import mongoose from 'mongoose'
import config from 'config'
import axios from 'axios'
import { Request, Response, NextFunction } from 'express'
import messages from '../utils/responseMessages'
import catchAsync from '../utils/catchAsync'
import { sendSuccessResponseWithoutList } from '../utils/helperFunctions'
import { OrderRepository } from '../repository/order.repository'
import { HistoryRepository } from '../repository/history.repository'
import { binanceCCTX, kucoinCCTX } from '../helper/cctxHelper'
import AppError from '../utils/appError'

export class OrderController {
	// FAKE ORDER CREATION
	static createOrder = catchAsync(async (req: any, res: Response, next: NextFunction) => {
		const { amount, exchange1, exchange2, exchange3, pair, time } = req.body
		const result = await OrderRepository.createOrder({
			amount,
			exchange1,
			exchange2,
			exchange3,
			pair,
			time,
		})

		if (result && typeof result !== 'boolean') {
			axios
				.post(`${config.get('PYTHON_URL')}/bot`, {
					renew_time: String(time),
					balance_to_use: String(amount),
					exchange_1: exchange1,
					exchange_2: exchange2,
					exchange_3: exchange3,
					crypto_pair: pair,
					orderId: result._id,
				})
				.then(() => {
					console.log('Success bot')
				})
				.catch((err) => {
					console.log('Failed bot', err)
				})

			const historyObj = {
				make: '',
				percentage: '',
				amount: '',
				orderId: result._id,
				status: 'pending',
				userId: new mongoose.Types.ObjectId(req.user._id),
			}

			await HistoryRepository.createHistory(historyObj)

			return sendSuccessResponseWithoutList(res, result, 201, messages.success.createMessage('order'))
		}
		return next(new AppError(messages.error.createFaildMessage('order'), 400))
	})

	static getHistories = catchAsync(async (req: any, res: Response, next: NextFunction) => {
		const { result, count } = await HistoryRepository.getHistories(new mongoose.Types.ObjectId(req.user._id))

		if (Array.isArray(result)) {
			return sendSuccessResponseWithoutList(res, { result, count }, 200, messages.success.listMessage('histories'))
		}

		return next(new AppError(messages.error.retrievedFailed('histories'), 400))
	})

	static getRealHistories = catchAsync(async (req: any, res: Response, next: NextFunction) => {
		const { result, count } = await HistoryRepository.getRealHistories(new mongoose.Types.ObjectId(req.user._id))

		if (Array.isArray(result)) {
			return sendSuccessResponseWithoutList(res, { result, count }, 200, messages.success.listMessage('histories'))
		}

		return next(new AppError(messages.error.retrievedFailed('histories'), 400))
	})

	static updateOrderDetails = catchAsync(async (req: any, res: Response, next: NextFunction) => {
		console.log('req.body', req.body)
		const { percentage, amount, orderId, status } = req.body
		let index = percentage.indexOf('-')
		const make = index === -1 ? 'profit' : 'loss'

		const result = await HistoryRepository.updateHistory(new mongoose.Types.ObjectId(orderId), {
			make,
			percentage,
			amount,
			status,
		})

		if (result && typeof result !== 'boolean') {
			return sendSuccessResponseWithoutList(res, result, 200, messages.success.updateMessage('order'))
		}

		return next(new AppError(messages.error.updateFaildMessage('order update'), 400))
	})

	// ACTUAL ORDER CREATION
	static createActualOrder = catchAsync(async (req: any, res: Response, next: NextFunction) => {
		let { amount, pair, symbol, exchangeToBuy, exchangeToSell } = req.body

		if (
			!(
				amount > 0 &&
				pair &&
				symbol &&
				(exchangeToBuy === 'binance' || exchangeToBuy === 'kucoin') &&
				(exchangeToSell === 'binance' || exchangeToSell === 'kucoin')
			)
		) {
			return next(new AppError(messages.error.invalidParameters, 400))
		}

		let buyCCTX = exchangeToBuy === 'binance' ? binanceCCTX : kucoinCCTX
		let sellCCTX = exchangeToSell === 'binance' ? binanceCCTX : kucoinCCTX

		const historyObj = {
			make: '',
			percentage: '',
			amount: '',
			buyOrderId: null,
			status: 'pending',
			userId: new mongoose.Types.ObjectId(req.user._id),
		}

		let createHistoryData: any = await HistoryRepository.createActualHistory(historyObj)

		const promise = new Promise(async (resolve, reject) => {
			try {
				// Fetch price
				const ticker = await buyCCTX.fetchTicker(pair)
				// Calculate quantity to buy based on USD amount provided by user.
				const desiredQuantityToBuy = Number((amount / ticker.ask).toFixed(9))
				console.log('desiredQuantityToBuy', desiredQuantityToBuy)

				// Fetch deposit address of coin into another exchange.
				const { address, tag } = await sellCCTX.fetchDepositAddress(symbol)
				console.log('address, tag', address, tag)

				if (address) {
					// Create Buy order
					const order: any = await buyCCTX.createMarketBuyOrder(pair, desiredQuantityToBuy)

					console.log('Order', order)

					if (order && order.id) {
						const orderDetails = await buyCCTX.fetchOrder(order.id, pair)
						console.log('orderDetails', orderDetails)
						const createObj = {
							actualAmount: amount,
							tradeAmount: orderDetails.cost,
							pair,
							side: 'buy',
							tradeStatus: 'done',
							withdrawStatus: 'pending',
							orderId: order.id,
							type: orderDetails.type,
							fee: exchangeToBuy === 'binance' ? order.fees[0] : orderDetails.fee,
							quantity: orderDetails.filled,
							price: orderDetails.price,
							userId: new mongoose.Types.ObjectId(req.user._id),
							exchangeToBuy: exchangeToBuy,
							exchangeToSell: exchangeToSell,
						}

						const createdOrder = await OrderRepository.createActualOrder(createObj)

						const withdrawQuantity = createObj.fee.currency === 'USDT' ? orderDetails.filled : orderDetails.filled - order.fees[0].cost
						console.log('withdrawQuantity', withdrawQuantity)
						if (exchangeToBuy === 'kucoin') {
							const transferFunds = await buyCCTX.transfer(symbol, Number(withdrawQuantity.toFixed(7)), 'trade', 'main')
						}
						console.log((await buyCCTX.fetchBalance())['CAKE'])
						await new Promise((resolve, reject) =>
							setTimeout(() => {
								resolve('')
							}, 10000)
						)
						const withdrawRequest = await buyCCTX.withdraw(symbol, Number(withdrawQuantity.toFixed(7)), address, tag)

						if (withdrawRequest && withdrawRequest.id) {
							const withdrawRequestDetails = (await buyCCTX.fetchWithdrawals(symbol)).find((el) => el.id == withdrawRequest.id)

							const withdrawObj = {
								buyOrderId: createdOrder?._id,
								withdrawId: withdrawRequest.id,
								withdrawAmount: withdrawQuantity,
								fee: withdrawRequestDetails?.fee,
								withdrawTo: withdrawRequestDetails?.addressTo,
								status: withdrawRequestDetails?.status || 'pending',
								currency: symbol,
								txId: withdrawRequestDetails?.txid,
							}

							await OrderRepository.createWithdraw(withdrawObj)
						}

						console.log('withdrawRequest', withdrawRequest)
						createHistoryData.buyOrderId = createdOrder?._id
						await createHistoryData.save()
						resolve('SUCCESS')
					}
				}
			} catch (err) {
				createHistoryData.status = 'failed'
				createHistoryData.errMessage = err?.message
				await createHistoryData.save()
				reject(err)
			}
		})

		promise
			.then(() => {
				console.log('Order bought successfully')
			})
			.catch((err) => {
				console.log('createActualOrder error', err)
			})

		return sendSuccessResponseWithoutList(res, {}, 201, messages.success.createMessage('order'))
	})
}
