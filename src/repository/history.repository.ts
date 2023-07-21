import HistoryModel, { History } from "../models/historyModel";

export class HistoryRepository {
  static createHistory = async (data): Promise<History | boolean> => {
    const result = await HistoryModel.create({ ...data });
    return result || false;
  };

  static getHistories = async (userId, extraParams): Promise<any> => {
    let { skip, limit } = extraParams;

    const count = (await HistoryModel.find({ userId: userId }).count()) || 0;

    const result = await HistoryModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("orderId");

    return { result, count } || false;
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
