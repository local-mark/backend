import jwt from "jsonwebtoken";
import { getAccessToken } from "../src/services/auth.service.js";
import { status } from "../config/response.status.js";
import { response } from "../config/response.js";

export const jwtMiddleware = async (req, res, next) => {
  // request 헤더로부터 access 토큰, 쿠키에서 refreshToken을
  const authHeader = req.headers["authorization"];
  const refreshToken = req.cookies.refreshToken;
  const secretKey = process.env.JWT_SECRET_KEY || "secret-key";

  if (!authHeader || authHeader === "null") {
    console.log("Authorization 토큰: 권한 없음");

    res.send(response(status.TOKEN_UNAUTHORIZED));
  }
  const authToken = authHeader.split(" ")[1];

  // 해당 token이 정상적인 token인지 확인
  try {
    const jwtDecoded = jwt.verify(authToken, secretKey);
    console.log("로그인한 user의 Id: " + jwtDecoded.id);

    req.currentId = jwtDecoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 액세스 토큰이 만료된 경우 리프레시 토큰 검증
      const userInfo = jwt.decode(authToken, secretKey);
      try {
        jwt.verify(refreshToken, secretKey);

        const newAccessToken = await getAccessToken(userInfo.id, refreshToken);
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.currentId = userInfo.id;

        next(); // 인증 성공, 다음 미들웨어로 제어 넘김
      } catch (refreshError) {
        res.send(response(status.TOKEN_UNAUTHORIZED));
      }
    } else {
      res.send(response(status.TOKEN_UNAUTHORIZED));
    }
  }
};
