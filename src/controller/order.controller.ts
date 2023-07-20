import mongoose from "mongoose";
import config from "config";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import messages from "../utils/responseMessages";
import catchAsync from "../utils/catchAsync";
import { sendSuccessResponseWithoutList } from "../utils/helperFunctions";
import { OrderRepository } from "../repository/order.repository";
import { HistoryRepository } from "../repository/history.repository";
import AppError from "../utils/appError";

export class OrderController {
  static createOrder = catchAsync(
    async (req: any, res: Response, next: NextFunction) => {
      const { amount, exchange1, exchange2, exchange3, pair, time } = req.body;
      const result = await OrderRepository.createOrder({
        amount,
        exchange1,
        exchange2,
        exchange3,
        pair,
        time,
      });

      if (result && typeof result !== "boolean") {
        /* const pythonResponse = await axios.post(
          `${config.get("PYTHON_URL")}/data`,
          {
            renew_time: String(time),
            balance_to_use: String(amount),
            exchange_1: exchange1,
            exchange_2: exchange2,
            exchange_3: exchange3,
            crypto_pair: pair,
          }
        ); */

        const historyObj = {
          make: "",
          percentage: "",
          amount: "",
          orderId: result._id,
          status: "pending",
          userId: new mongoose.Types.ObjectId(req.user._id),
        };

        await HistoryRepository.createHistory(historyObj);

        return sendSuccessResponseWithoutList(
          res,
          result,
          201,
          messages.success.createMessage("order")
        );
      }
      return next(
        new AppError(messages.error.createFaildMessage("order"), 400)
      );
    }
  );

  static getHistories = catchAsync(
    async (req: any, res: Response, next: NextFunction) => {
      const result = await HistoryRepository.getHistories(
        new mongoose.Types.ObjectId(req.user._id)
      );

      if (Array.isArray(result)) {
        return sendSuccessResponseWithoutList(
          res,
          result,
          200,
          messages.success.listMessage("histories")
        );
      }

      return next(
        new AppError(messages.error.retrievedFailed("histories"), 400)
      );
    }
  );

  static updateOrderDetails = catchAsync(
    async (req: any, res: Response, next: NextFunction) => {
      const { make, percentage, amount, orderId, status } = req.body;

      const result = await HistoryRepository.updateHistory(
        new mongoose.Types.ObjectId(orderId),
        {
          make,
          percentage,
          amount,
          status,
        }
      );

      if (result && typeof result !== "boolean") {
        return sendSuccessResponseWithoutList(
          res,
          result,
          200,
          messages.success.updateMessage("order")
        );
      }

      return next(
        new AppError(messages.error.updateFaildMessage("order update"), 400)
      );
    }
  );
}
