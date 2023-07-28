import mongoose from 'mongoose'

export interface Withdraw extends Document {
	buyOrderId: object
	withdrawId: string
	withdrawAmount: number
	fee: object
	withdrawTo: string
	status: string
	currency: string
	txId: string
	_id?: mongoose.Types.ObjectId
}

const withdrawSchema = new mongoose.Schema<Withdraw>(
	{
		buyOrderId: {
			type: mongoose.Types.ObjectId,
			ref: 'ActualOrder',
		},
		withdrawId: String,
		withdrawAmount: Number,
		fee: Object,
		withdrawTo: String,
		status: String,
		currency: String,
		txId: String,
	},
	{
		timestamps: true,
		collection: 'withdraws',
	}
)

const WithdrawModel = mongoose.model<Withdraw>('Withdraw', withdrawSchema)
export default WithdrawModel
