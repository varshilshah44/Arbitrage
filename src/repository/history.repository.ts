import HistoryModel, { History } from "../models/historyModel";

export class HistoryRepository {
  static createHistory = async (data): Promise<History | boolean> => {
    const result = await HistoryModel.create({ ...data });
    return result || false;
  };

  static getHistories = async (userId): Promise<History[] | boolean> => {
    const result = await HistoryModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("orderId");

    return result || false;
  };

  static updateHistory = async (
    orderId,
    updateObj
  ): Promise<History | boolean> => {
    console.log(orderId);
    const result = await HistoryModel.findOneAndUpdate(
      { orderId },
      { ...updateObj },
      {
        new: true,
      }
    );

    return result || false;
  };
}
