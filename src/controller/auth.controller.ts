import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from "config";
import AppError from "../utils/appError";
import messages from "../utils/responseMessages";
import { UserRepository } from "../repository/user.repository";
import catchAsync from "../utils/catchAsync";
import { signUpValidation } from "../validations/user.validation";
import { sendSuccessResponseWithoutList } from "../utils/helperFunctions";

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

export class AuthController {
  // creates a jwt token to send it to the user
  static signToken = (id: String) => {
    return jwt.sign({ id }, config.get("JWT_SECRET"), {
      expiresIn: config.get("JWT_EXPIRES_IN"),
    });
  };

  static encryptPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
  };

  static createSendToken = (
    user,
    statusCode: number,
    res: Response,
    message: string = ""
  ) => {
    const token = this.signToken(user._id);

    const cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(config.get("JWT_TOKEN_EXPIRES_IN")) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
      status: "Logged in successfully.",
      statusCode,
      message,
      token,
      data: user,
    });
  };

  static signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const validate = signUpValidation(req.body);
      if (!validate.status) {
        return next(
          new AppError(validate.error || messages.error.invalidParameters, 400)
        );
      }

      let { name, email, password } = req.body;
      email = email.toLowerCase().trim();
      const emailExist = await UserRepository.getUserByEmail(email);
      if (emailExist) {
        return next(new AppError(messages.error.alreadyExist("email"), 400));
      }
      const encryptedPassword = await this.encryptPassword(password);
      const data = {
        name,
        email: email,
        password: encryptedPassword,
      };

      const newUser = await UserRepository.createUser(data);
      if (newUser) {
        const { password, ...otherData } = newUser.toObject();
        return sendSuccessResponseWithoutList(
          res,
          otherData,
          201,
          messages.success.signUpMessage
        );
      }
      return next(new AppError(messages.error.signUpFailed, 500));
    }
  );

  static userLogin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = await UserRepository.getUserByEmail(email);
      if (
        !user ||
        !(await user.schema.methods.verifyPassword(password, user.password))
      ) {
        return next(new AppError(messages.error.validEmailPassword, 401));
      }

      // send the response with jwt token
      this.createSendToken(user, 200, res);
    }
  );

  static verifyJwtToken = catchAsync(
    async (req: any, res: Response, next: NextFunction) => {
      let token: string;
      // Check whether the token is present or not in the request
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }
      if (!token) {
        return next(
          new AppError(
            "Sorry, you are not authorized to access this API. Please contact the administrator for assistance.",
            401
          )
        );
      }

      const decoded = jwt.verify(
        token,
        config.get("JWT_SECRET")
      ) as jwt.JwtPayload;

      // Attach id so that the next middleware can have the id to search for the user
      req.id = decoded.id;

      next();
    }
  );

  static verifyUserAndAttachToRequest = catchAsync(
    async (req: any, res: Response, next: NextFunction) => {
      const user = await UserRepository.getUserById(req.id);

      if (!user || user.deletedAt) {
        return next(new AppError(messages.error.userNotFound, 400));
      }

      // We can write the logic to check whether the admin is trying to access any api after
      // he changes the password. We do not want to authenticate the old token after the user
      // changes the password

      // Attach the user to the request body so that it can be used in the next middleware
      req.user = user;

      next();
    }
  );
}
