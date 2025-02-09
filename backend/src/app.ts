import * as express from "express";
import * as dotenv from "dotenv";
import * as cookieparser from "cookie-parser";
import * as cors from "cors";
import * as session from "express-session";
import * as passport from "passport";
import "./config/passport.config";

dotenv.config();
export const app = express();

// middlewares
app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   async (req, res) => {
//     // Successful authentication, redirect or respond with tokens
//     const user = req.user as any;
//     const accessToken = generateAccessToken(user.id);
//     const refreshToken = generateRefreshToken(user.id);

//     user.refreshToken = refreshToken;
//     await user.save();

//     const loggedInUser = {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       phone: user.phone,
//       avatar: user.avatar,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     };

//     res
//       .status(200)
//       .cookie("accessToken", accessToken, {
//         secure: process.env.NODE_ENV === "production",
//         httpOnly: true,
//       })
//       .cookie("refreshToken", refreshToken, {
//         secure: process.env.NODE_ENV === "production",
//         httpOnly: true,
//       })
//       .json(
//         new ApiResponse(
//           200,
//           { user: loggedInUser, accessToken, refreshToken },
//           "User logged in successfully"
//         )
//       );
//   }
// );

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user as any;

    const accessToken = generateAccessToken(user.id);

    const userString = encodeURIComponent(JSON.stringify(user));

    // Send tokens in response
    res.redirect(
      `http://localhost:5173/?accessToken=${accessToken}&user=${userString}`
    );
  }
);

import { authRouter } from "./routes/auth.routes";

app.use("/api/v1/auth", authRouter);

// custom middleware
import { notFound, errorHandler } from "./middleware/errorHandler.middleware";
import { ApiResponse } from "./utils/ApiResponse";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./utils/generateToken";

app.use(notFound);
app.use(errorHandler);
