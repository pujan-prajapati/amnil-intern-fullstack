import { Request, Response } from "express";
import * as asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse";
import * as authServices from "../services/auth.services";
import { validateId } from "../utils/validateId";
import { sendMail } from "../utils/sendMail";
import * as jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { Auth } from "../entity/auth.entity";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      username: string;
      email: string;
      phone?: string;
      avatar?: string;
      createdAt: Date;
      updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
  }
}

// register user
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, phone } = req.body;

    const avatarLocalPath = req.file.path;
    if (!avatarLocalPath) {
      throw new Error("Avatar file is missing");
    }

    const user = await authServices.registerUser(
      username,
      email,
      password,
      phone,
      avatarLocalPath
    );

    res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  }
);

// login user token based
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authServices.loginUser(
    email,
    password
  );

  const options = {
    secure: true,
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// login use session based
// export const loginUser = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const { user, accessToken, refreshToken } = await authServices.loginUser(
//     email,
//     password
//   );

//   req.session.user = user;
//   req.session.accessToken = accessToken;
//   req.session.refreshToken = refreshToken;

//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { user, accessToken, refreshToken },
//         "User logged in successfully"
//       )
//     );
// });

// logout user token based
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  await authServices.logoutUser(id);

  res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
    message: "User logged out successfully",
    success: true,
  });
});

// logout user session bases
// export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
//   req.session.destroy((err) => {
//     if (err) {
//       throw new Error("Unable to log out. Please try again.");
//     }
//     res
//       .clearCookie("connect.sid", {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//       })
//       .status(200)
//       .json({ success: true, message: "Logged out successfully" });
//   });
// });

// refresh token
export const resfreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRereshToken = req.cookies.refreshToken;

    if (!incomingRereshToken) {
      throw new Error("Unauthorized required");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRereshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as {
        id: string;
      };
      const user = await Auth.findOneBy({ id: decodedToken.id });
      if (!user) {
        throw new Error("Invalid refresh token");
      }

      if (incomingRereshToken !== user?.refreshToken) {
        throw new Error("Refresh token is expired or used");
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      const accessToken = await generateAccessToken(user.id);
      const newRefreshToken = await generateRefreshToken(user.id);

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Login successful"
          )
        );
    } catch (error) {
      throw new Error(error?.message || "Invalid refresh token");
    }
  }
);

// get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { users, totalUsers } = await authServices.getAllUsers();

  res
    .status(200)
    .json(
      new ApiResponse(200, { users, totalUsers }, "Users fetched successfully")
    );
});

// get user by id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  const findUser = await authServices.getUserById(id);

  res
    .status(200)
    .json(new ApiResponse(200, findUser, "User fetched successfully"));
});

// delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateId(id);

  await authServices.deleteUser(id);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

// update user info
export const updateUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateId(id);
    const { oldPassword, newPassword } = req.body;

    await authServices.updateUserPassword(id, oldPassword, newPassword);

    res.status(200).json(new ApiResponse(200, null, "Password updated"));
  }
);

// forgot password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const { otp, user } = await authServices.forgotPassword(email);

    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is ${otp}`;
    const html = `
  <h1>Password Reset OTP</h1>
  <p>Your OTP for password reset is <strong>${otp}</strong></p>
  <p>OTP will expire in 5 minutes</p>
  `;

    await sendMail(email, subject, text, html);

    res
      .status(200)
      .json(new ApiResponse(200, { user }, "OTP Sent Successfully"));
  }
);

// verifyOTP
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  await authServices.verfiyOTP(email, otp);
  res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

// reset password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await authServices.resetPassword(
      email,
      newPassword,
      confirmPassword
    );

    res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successfully"));
  }
);
