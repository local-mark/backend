import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { findByID, findByLoginID, findByEmail, createUser, updateUser, getUsernameByEmail, getOrdersByID, getOrderItemNumberByIDs, getOrderItems, updatePassword, verifyEmail, resetPasswordByEmail, deleteUserById, restoreUserById } from '../models/user.dao.js';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const registerUserService = async (userData, type) => {
    const existingUserByID = await findByLoginID(userData.loginId);
    if (existingUserByID) {
        throw new Error('This id is already in use.');
    }
    const existingUser = await findByEmail(userData.email);
    if (existingUser) {
        throw new Error('This email is already in use.');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await createUser(userData, hashedPassword, type);
    return { ...userData };
};


export const findUsernameByEmailService = async (email) => {
    try {
        const user = await getUsernameByEmail(email);
        if (user) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Account Username',
                text: `Your username is: ${user.id}`,
            };
            await transporter.sendMail(mailOptions);
            return user;
        }
        return false;
    } catch (error) {
        throw error;
    }
};

export const getOrdersService = async (user_id) => {
    try {
        const orders = await getOrdersByID(user_id);
        return orders;
    } catch (error) {
        throw error;
    }
};

export const getOrderItemNumberService = async (ids) => {
    try {
        const itemNumber = await getOrderItemNumberByIDs(ids);
        return itemNumber;
    } catch (error) {
        throw error;
    }
};

export const getOrderItemsService = async (itemNumber) => {
    try {
        const items = await getOrderItems(itemNumber);
        return items;
    } catch (error) {
        throw error;
    }
};

export const updateUserService = async (userId, userData) => {
    try {
        const existingUserByID = await findByID(userData.loginId);
        if (existingUserByID) {
            throw new Error('This id is already in use.');
        }
        const existingUser = await findByEmail(userData.email);
        if (existingUser) {
            throw new Error('This email is already in use.');
        }
        const updatedUser = await updateUser(userId, userData);
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

export const updatePasswordService = async (userId, newPassword) => {
    try{
        const newHashedPassword = await bcrypt.hash(newPassword['password'], 10);
        const updatedPasswordUser = await updatePassword(userId, newHashedPassword);
        return updatedPasswordUser;
    } catch (error) {
        throw error;
    }
};

export const updatePasswordEmailService = async (userId) =>{
    try{
        const userData = await findByID(userId);
        if (userData) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userData.email,
                subject: 'Your Account Username',
                text: `비밀번호 변경링크입니다.\n\nhttps://example.com/${userData.id}/change-password`,
            };
            await transporter.sendMail(mailOptions);
            return true;
        }
        return false;
    } catch(error){
        throw error;
    }
}

export const resetPassword = async (loginId, email) => {
    const user = await verifyEmail(loginId, email);
    if (user == -1) {
        throw new BaseError(status.LOGINID_NOT_EXISTS);
    } else if (user == -2) {
        throw new BaseError(status.EMAIL_NOT_EXISTS);
    }
  
    const result = await resetPasswordByEmail(email);
    if (result == -1) {
      throw new BaseError(status.EMAIL_SENDING_FAILED);
    }
  
    return "비밀번호 찾기 메일 전송에 성공하였습니다.";
  };
  
  export const deleteUser = async (userId) => {
    const user = await findByID(userId);
    if (!user) {
        throw new BaseError(status.USER_NOT_EXISTS);
    }

    if (user.status == 'ACTIVE') {
        await deleteUserById(userId);
        return 1;
    } else if(user.status == 'INACTIVE') {
        await restoreUserById(userId);
        return 2;
    }
  };