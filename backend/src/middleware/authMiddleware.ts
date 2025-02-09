import * as jwt from "jsonwebtoken";
import { Auth } from "../entity/auth.entity";
import { Request, Response, NextFunction } from "express";
import * as asyncHandler from "express-async-handler";

declare module "express" {
  interface Request {
    user?: Auth;
  }
}

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = "";
    try {
      if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
          id: string;
        };
        req.user = await Auth.findOneBy({ id: decoded.id });

        next();
      } else {
        throw new Error("Not authorized. Please login again");
      }
    } catch (error) {
      throw new Error("There is no token or token expired");
    }
  }
);

export const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const user = await Auth.findOneBy({ id: userId });

    if (user.role !== "admin") {
      throw new Error("You are not admin");
    }
    next();
  }
);
