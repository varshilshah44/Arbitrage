import OrderModel, { Order } from "../models/orderModel";

export class OrderRepository {
  static createOrder = async (data): Promise<Order | boolean> => {
    const result = await OrderModel.create({ ...data });
    return result || false;
  };
}
