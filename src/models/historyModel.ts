import { string } from "joi";
import mongoose, { Document } from "mongoose";

export interface History extends Document {
  make: string;
  percentage: string;
  amount: number;
  orderId: any;
  status: string;
  userId: mongoose.Types.ObjectId;
}

const historySchema = new mongoose.Schema<History>(
  {
    make: String,
    percentage: String,
    amount: Number,
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    status: String,
    userId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
    collection: "histories",
  }
);

const HistoryModel = mongoose.model<History>("History", historySchema);
export default HistoryModel;
