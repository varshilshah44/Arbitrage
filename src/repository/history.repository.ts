import HistoryModel, { History } from '../models/historyModel'
import ActualHistoryModel, { ActualHistory } from '../models/actualHistoryModel'

export class HistoryRepository {
	static createHistory = async (data): Promise<History | boolean> => {
		const result = await HistoryModel.create({ ...data })
		return result || false
	}

	static createActualHistory = async (data): Promise<ActualHistory | boolean> => {
		const result = await ActualHistoryModel.create({ ...data })
		return result || false
	}

	static getHistories = async (userId): Promise<any> => {
		//	let { skip, limit } = extraParams

		const count = (await HistoryModel.find({ userId: userId }).count()) || 0

		const result = await HistoryModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('orderId')

		return { result, count } || false
	}

	static getRealHistories = async (userId): Promise<any> => {
		//	let { skip, limit } = extraParams

		const count = (await ActualHistoryModel.find({ userId: userId }).count()) || 0

		const result = await ActualHistoryModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('buyOrderId').populate('sellOrderId')

		return { result, count } || false
	}

	static updateHistory = async (orderId, updateObj): Promise<History | boolean> => {
		console.log(orderId)
		const result = await HistoryModel.findOneAndUpdate(
			{ orderId },
			{ ...updateObj },
			{
				new: true,
			}
		)

		return result || false
	}

	static updateActualHistory = async (orderId, updateObj): Promise<ActualHistory | boolean> => {
		console.log(orderId)
		const result = await ActualHistoryModel.findOneAndUpdate(
			{
				buyOrderId: orderId,
			},
			{ ...updateObj },
			{
				new: true,
			}
		)

		return result || false
	}
}
