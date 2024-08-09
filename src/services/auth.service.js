import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {
  verifyUser,
  createAccessToken,
  updateToken,
  removeRefreshToken,
} from "../models/auth.dao.js";
import jwt from "jsonwebtoken";

export const userLogin = async (body) => {
  // 유저 아이디, 비밀번호 받아옴
  const result = await verifyUser(body);

  if (result == -1) {
    throw new BaseError(status.LOGINID_NOT_EXISTS);
  } else if (result == -2) {
    throw new BaseError(status.PASSWORD_NOT_MATCHED);
  }
  if (result.status == "INACTIVE") {
    return { userId: result.id, inactiveDate: result.inactive_date }
  }

  const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
  const accessToken = jwt.sign({ id: result.id, type: result.type }, secretKey, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id: result.id, type: result.type }, secretKey, {
    expiresIn: "24h",
  });

  // refresh token을 DB에 저장
  const rows = await updateToken(result.id, refreshToken);
  if (rows == 0) {
    throw new BaseError(status.TOKEN_UPDATE_FAILED);
  }

  return { loginId: result.loginId, accessToken, refreshToken };
};

export const getAccessToken = async (userId, refreshToken) => {
  const result = await createAccessToken(userId, refreshToken);
  if (result == -1) {
    throw new BaseError(status.TOKEN_NOT_EXISTS);
  }

  return result;
};

export const userLogout = async (body, refreshToken) => {
  const result = await removeRefreshToken(body.userId, refreshToken);
  if (result == -1) {
    throw new BaseError(status.TOKEN_UNAUTHORIZED);
  } else if (result == 0) {
    throw new BaseError(status.TOKEN_UPDATE_FAILED);
  }

  return "성공적으로 로그아웃 되었습니다.";
};
