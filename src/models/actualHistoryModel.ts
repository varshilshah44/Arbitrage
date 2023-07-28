import { string } from 'joi'
import mongoose, { Document } from 'mongoose'

export interface ActualHistory extends Document {
	make: string
	percentage: string
	amount: number
	buyOrderId: any
	sellOrderId: any
	status: string
	errMessage: string
	userId: mongoose.Types.ObjectId
}

const actualHistorySchema = new mongoose.Schema<ActualHistory>(
	{
		make: String,
		percentage: String,
		amount: Number,
		buyOrderId: {
			type: mongoose.Types.ObjectId,
			ref: 'ActualOrder',
		},
		sellOrderId: {
			type: mongoose.Types.ObjectId,
			ref: 'ActualOrder',
		},
		status: String,
		userId: mongoose.Types.ObjectId,
		errMessage: String,
	},
	{
		timestamps: true,
		collection: 'actualHistories',
	}
)

const ActualHistoryModel = mongoose.model<ActualHistory>('ActualHistory', actualHistorySchema)
export default ActualHistoryModel
