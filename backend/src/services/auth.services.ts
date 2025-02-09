import { Auth } from "../entity/auth.entity";
import * as bcryptjs from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

// find user
export const findUser = async (email: string) => {
  const user = await Auth.findOneBy({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// register user
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  phone: string,
  avatarLocalPath: string
) => {
  const existingUser = await Auth.findOneBy({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const avatarUrl = await uploadOnCloudinary(
    avatarLocalPath,
    "amnil_intern_avatar"
  );

  if (!avatarUrl) {
    throw new Error("Error while uploading avatar to cloudinary");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = Auth.create({
    username: username,
    email: email,
    password: hashedPassword,
    phone: phone,
    avatar: avatarUrl.url,
  });

  await user.save();
  return user;
};

// login user
export const loginUser = async (email: string, password: string) => {
  const user = await Auth.findOneBy({ email });
  if (!user) {
    throw new Error("invalid credentials");
  }

  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  user.refreshToken = refreshToken;
  await user.save();

  const loggedInUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: loggedInUser, accessToken, refreshToken };
};

// logout user
export const logoutUser = async (id: string) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }

  user.refreshToken = null;
  await user.save();
  return user;
};

// get all users
export const getAllUsers = async () => {
  const [users, totalUsers] = await Auth.findAndCount();
  return { users, totalUsers };
};

// get user by id
export const getUserById = async (id: string) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// delete user
export const deleteUser = async (id: string) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.avatar) {
    await deleteFromCloudinary(user.avatar);
  }

  await Auth.delete(user.id);
  return user;
};

// update password
export const updateUserPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }

  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);
  if (!isOldPasswordMatch) {
    throw new Error("Invalid old password");
  }

  const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

  user.password = hashedNewPassword;
  user.save();

  return user;
};

// generate Otp
const generateOTP = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

// forgot password
export const forgotPassword = async (email: string) => {
  const user = await findUser(email);

  const otp = generateOTP();
  const optExpiry = Date.now() + 5 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = optExpiry;
  await user.save();

  return { user, otp };
};

// verify otp
export const verfiyOTP = async (email: string, otp: number) => {
  const user = await findUser(email);
  if (otp !== user.otp) {
    throw new Error("Invalid OTP");
  }

  if (Date.now() > user.otpExpiry) {
    throw new Error("OTP expired");
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return user;
};

// resetPassword
export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  const user = await findUser(email);
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return user;
};
