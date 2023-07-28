import mongoose from 'mongoose'
import WithdrawModel, { Withdraw } from '../models/withdrawModel'
import { OrderRepository } from '../repository/order.repository'
import { HistoryRepository } from '../repository/history.repository'
import { binanceCCTX, kucoinCCTX } from './cctxHelper'

export const checkWithrawStatus = async () => {
	try {
		console.log('----Inside checkWithrawStatus cron function----')
		// Fetching pending withdraw request
		const getWithdraw: any = await WithdrawModel.findOne({
			status: 'pending',
		})
			.sort({ createdAt: 1 })
			.populate('buyOrderId')

		if (getWithdraw) {
			let buyCCTX = getWithdraw.buyOrderId.exchangeToBuy === 'binance' ? binanceCCTX : kucoinCCTX
			let sellCCTX = getWithdraw.buyOrderId.exchangeToSell === 'binance' ? binanceCCTX : kucoinCCTX

			// Checking withdraw request is done or not
			const fetchWithdrawStatus = (await buyCCTX.fetchWithdrawals(getWithdraw.currency)).find((el) => el.id == getWithdraw.withdrawId)
			getWithdraw.fee = fetchWithdrawStatus?.fee || null
			getWithdraw.withdrawTo = fetchWithdrawStatus?.addressTo || null
			await getWithdraw.save()
			console.log('fetchWithdrawStatus', fetchWithdrawStatus)
			if (fetchWithdrawStatus?.txid && fetchWithdrawStatus?.status === 'ok') {
				const fetchDepositStatus = (await sellCCTX.fetchDeposits(getWithdraw.currency)).find((el) => el.txid == fetchWithdrawStatus.txid)
				console.log('fetchDepositStatus', fetchDepositStatus)
				if (fetchDepositStatus && fetchDepositStatus?.status === 'ok') {
					// Transfer coin from main(funding) account to trade account for selling.
					if (getWithdraw.buyOrderId.exchangeToSell === 'kucoin') {
						const transferFunds = await sellCCTX.transfer(getWithdraw.currency, fetchDepositStatus.amount, 'main', 'trade')
					}

					// Create market sell order
					const sellOrder: any = await sellCCTX.createMarketSellOrder(getWithdraw.buyOrderId.pair, fetchDepositStatus.amount)
					console.log('sellOrder', sellOrder)
					if (sellOrder && sellOrder.id) {
						// Fetching sell order details
						const orderDetails: any = await sellCCTX.fetchOrder(sellOrder.id, getWithdraw.buyOrderId.pair)
						console.log('SellOrderDetails', orderDetails)
						const createObj = {
							actualAmount: orderDetails.cost,
							tradeAmount: orderDetails.cost,
							pair: getWithdraw.buyOrderId.pair,
							side: 'sell',
							tradeStatus: 'done',
							withdrawStatus: 'pending',
							orderId: sellOrder.id,
							type: orderDetails.type,
							fee: getWithdraw.buyOrderId.exchangeToSell === 'kucoin' ? orderDetails?.fee : sellOrder?.fees[0],
							quantity: orderDetails.filled,
							price: orderDetails.price,
							userId: getWithdraw.buyOrderId.userId,
							exchange: getWithdraw.buyOrderId.exchangeToSell,
						}

						const createdSellOrder = await OrderRepository.createActualOrder(createObj)

						getWithdraw.status = 'ok'
						getWithdraw.txId = fetchWithdrawStatus.txid
						await getWithdraw.save()

						// Calculate profit and loss
						let sellOrderAmount =
							createdSellOrder?.fee?.currency !== 'USDT'
								? createdSellOrder.tradeAmount
								: Number((createdSellOrder.tradeAmount - createdSellOrder?.fee?.cost).toFixed(9))
						let tradeAmount =
							getWithdraw?.buyOrderId?.fee?.currency !== 'USDT'
								? getWithdraw.buyOrderId.tradeAmount
								: Number((getWithdraw.buyOrderId.tradeAmount - getWithdraw.buyOrderId.fee?.cost).toFixed(9))
						console.log('sellOrderAmount', sellOrderAmount)
						console.log('tradeAmount', tradeAmount)
						let make = tradeAmount > sellOrderAmount ? 'loss' : 'profit'
						let percentage =
							make === 'profit'
								? Number((((sellOrderAmount - tradeAmount) / tradeAmount) * 100).toFixed(9)) + '%'
								: '-' + Number((((tradeAmount - sellOrderAmount) / tradeAmount) * 100).toFixed(9)) + '%'
						let amount =
							make === 'profit'
								? Number((sellOrderAmount - tradeAmount).toFixed(9))
								: -Number((tradeAmount - sellOrderAmount).toFixed(9))

						console.log('make', make)
						console.log('percentage', percentage)
						console.log('amount', amount)
						const updateHistoryObj = {
							make,
							percentage,
							amount,
							status: 'done',
							sellOrderId: createdSellOrder._id,
						}

						const result = await HistoryRepository.updateActualHistory(
							new mongoose.Types.ObjectId(getWithdraw.buyOrderId._id),
							updateHistoryObj
						)
					}
				} else {
					console.log(`Deposite is still in processing or failed (${getWithdraw.buyOrderId.exchangeToSell})`)
				}
			} else {
				console.log(`Withdraw is still in processing or failed (${getWithdraw.buyOrderId.exchangeToBuy})`)
			}
		}
	} catch (err) {
		console.log('checkWithrawStatus error ', err)
	}
}
