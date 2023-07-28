import OrderModel, { Order } from '../models/orderModel'
import ActualOrderModel, { ActualOrder } from '../models/actualOrderModel'
import WithdrawModel, { Withdraw } from '../models/withdrawModel'

export class OrderRepository {
	static createOrder = async (data): Promise<Order | boolean> => {
		const result = await OrderModel.create({ ...data })
		return result || false
	}

	static createActualOrder = async (data): Promise<any> => {
		const result = await ActualOrderModel.create({ ...data })
		return result || false
	}

	static createWithdraw = async (data): Promise<Withdraw | boolean> => {
		const result = await WithdrawModel.create({ ...data })
		return result || false
	}

	static getActualOrderData = async (query): Promise<any> => {
		const result = await ActualOrderModel.findOne(query)
		return result || false
	}
}
