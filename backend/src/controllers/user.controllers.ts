import { Request, Response } from "express";
import { Users } from "../entity/users.entity";
import * as asyncHandler from "express-async-handler";

// create a user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, age, gender } = req.body;

  const existingUser = await Users.findOneBy({ email });

  if (existingUser) {
    res.status(400).json({
      message: "User already exists",
    });
  }

  const user = Users.create({
    firstName,
    lastName,
    email,
    age,
    gender,
  });

  await user.save();

  res.status(201).json({
    message: "User created successfully",
    user,
  });
});

// get all users
export const getAllusers = asyncHandler(async (req: Request, res: Response) => {
  const users = await Users.find();

  res.status(200).json({
    users,
  });
});

// get user by id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const findUser = await Users.findOneBy({ id: Number(id) });
  if (!findUser) {
    res.status(400).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    user: findUser,
  });
});

//update user
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, age, gender } = req.body;

  const findUser = await Users.findOneBy({ id: Number(id) });
  if (!findUser) {
    res.status(400).json({
      message: "User not found",
    });
  }

  Users.merge(findUser, { firstName, lastName, email, age, gender });
  await Users.save(findUser);

  res.status(200).json({
    message: "User updated successfully",
    user: findUser,
  });
});

// delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const findUser = await Users.findOneBy({ id: Number(id) });
  if (!findUser) {
    res.status(400).json({
      message: "User not found",
    });
  }

  await findUser.remove();

  res.status(200).json({
    message: "User deleted successfully",
  });
});
