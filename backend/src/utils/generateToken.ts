import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
