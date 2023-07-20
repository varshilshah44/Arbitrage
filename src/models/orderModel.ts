import mongoose from "mongoose";

export interface Order extends Document {
  amount: number;
  exchange1: string;
  exchange2: string;
  exchange3: string;
  pair: string;
  time: number;
  _id?: mongoose.Types.ObjectId;
}

const orderSchema = new mongoose.Schema<Order>(
  {
    amount: Number,
    exchange1: String,
    exchange2: String,
    exchange3: String,
    pair: String,
    time: Number,
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const OrderModel = mongoose.model<Order>("Order", orderSchema);
export default OrderModel;
