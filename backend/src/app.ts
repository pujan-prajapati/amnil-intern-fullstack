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
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
import { generateAccessToken } from "./utils/generateToken";
import { authRouter } from "./routes/auth.routes";

app.use("/api/v1/auth", authRouter);

// google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user as any;

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateAccessToken(user.id);

    // Send tokens in response
    res.redirect(
      `http://localhost:5173/?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

// custom middleware
import { notFound, errorHandler } from "./middleware/errorHandler.middleware";

app.use(notFound);
app.use(errorHandler);
