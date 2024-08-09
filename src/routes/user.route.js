import express from "express";
import { registerGeneral, registerCreator, findUsername, getOrderItems, updateUser, updatePassword, updatePasswordEmail, findPassword, removeUser } from "../controllers/user.controller.js";
import { jwtMiddleware } from "../../config/userJwtMiddleWare.js";
import asyncHandler from "express-async-handler";

export const userRouter = express.Router();

userRouter.post('/signup/creator', registerCreator);
userRouter.post('/signup/general', registerGeneral);
userRouter.post('/find-username', findUsername);
userRouter.get('/:userId/orders', jwtMiddleware, getOrderItems);
userRouter.patch('/:userId', jwtMiddleware, updateUser); // pw 를 제외한 유저정보 수정
userRouter.patch('/:userId/change-password', jwtMiddleware, updatePassword); // pw 수정
userRouter.post('/:userId/change-password-email', jwtMiddleware, updatePasswordEmail); // pw 수정을 위한 이메일
userRouter.post("/find-password", jwtMiddleware, asyncHandler(findPassword));
userRouter.patch("/:userId/status", jwtMiddleware, asyncHandler(removeUser));
