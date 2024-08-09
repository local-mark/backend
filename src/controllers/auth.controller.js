import { response } from "../../config/response.js";
import jwt from "jsonwebtoken";
import { status } from "../../config/response.status.js";
import { userLogin, userLogout } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  console.log("로그인 요청입니다.");
  console.log(req.body);

  const result = await userLogin(req.body);
  
  if (result.inactiveDate) {
    res.send(response(status.ACCOUNT_CANCELED, { id: result.userId, inactive_date: result.inactiveDate}));
  } else {
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    });
    res.cookie("loginId", result.loginId, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3일
    });
    res.send(response(status.SUCCESS, { accessToken: result.accessToken }));
  }
};

export const logout = async (req, res, next) => {
  console.log("로그아웃 요청입니다.");

  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.send(response(status.TOKEN_NOT_EXISTS));
  }

  const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
  const decoded = jwt.verify(refreshToken, secretKey);
  if (!decoded) {
    res.send(response(status.TOKEN_UNAUTHORIZED));
  }

  const result = await userLogout(req.body, refreshToken);

  req.headers["authorization"] = null;
  res.clearCookie("refreshToken");

  res.send(response(status.SUCCESS, result));
};
