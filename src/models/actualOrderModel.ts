import mongoose from 'mongoose'

export interface ActualOrder extends Document {
	actualAmount: number
	tradeAmount: number
	pair: string
	side: string
	tradeStatus: string
	withdrawStatus: string
	orderId: string
	type: string
	fee: object
	quantity: number
	price: number
	userId: object
	exchangeToBuy: string
	exchangeToSell: string
	_id?: mongoose.Types.ObjectId
}

const actualOrderSchema = new mongoose.Schema<ActualOrder>(
	{
		actualAmount: Number,
		tradeAmount: Number,
		side: String,
		tradeStatus: String,
		withdrawStatus: String,
		orderId: String,
		pair: String,
		type: String,
		fee: Object,
		quantity: Number,
		price: Number,
		exchangeToBuy: String,
		exchangeToSell: String,
		userId: {
			type: mongoose.Types.ObjectId,
			ref: 'users',
		},
	},
	{
		timestamps: true,
		collection: 'actualOrders',
	}
)

const ActualOrderModel = mongoose.model<ActualOrder>('ActualOrder', actualOrderSchema)
export default ActualOrderModel
