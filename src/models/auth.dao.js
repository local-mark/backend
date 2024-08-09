import jwt from "jsonwebtoken";
import { pool } from "../../config/database.js";
import bcrypt from "bcrypt";
import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import {
  confirmLoginId,
  selectUserSql,
  updateTokenSql,
  confirmToken,
  selectTokenSql,
} from "../models/auth.sql.js";

export const verifyUser = async (body) => {
  const { loginId, password } = body;

  try {
    const conn = await pool.getConnection();

    const [confirm] = await pool.query(confirmLoginId, [loginId]);
    if (!confirm[0].isExistLoginId) {
      conn.release();
      return -1;
    }

    const [rows] = await pool.query(selectUserSql, [loginId]);
    const user = rows[0];

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      conn.release();
      return -2;
    }

    conn.release();
    return user;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};
export const updateToken = async (userId, token) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await pool.query(updateTokenSql, [token, userId]);

    conn.release();
    return result.affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const createAccessToken = async (userId, token) => {
  try {
    const conn = await pool.getConnection();

    const [confirm] = await pool.query(confirmToken, [userId, token]);
    // Token이 동일하고 유효기간이 지나지 않았다면 -> 검증
    if (!confirm[0].isExistToken) {
      conn.release();
      return -1;
    }
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const newAccessToken = jwt.sign({ id: userId }, secretKey, {
      expiresIn: "1h",
    });

    return newAccessToken;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const removeRefreshToken = async (userId, refreshToken) => {
  try {
    const conn = await pool.getConnection();
    console.log(userId);
    const [rows] = await pool.query(selectTokenSql, [userId]);
    const userToken = rows[0].token;

    console.log("User Token:", userToken);
    console.log("Refresh Token:", refreshToken);

    if (refreshToken != userToken) {
      conn.release();
      return -1;
    }

    const [result] = await pool.query(updateTokenSql, [null, userId]);

    conn.release();
    return result.affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};
