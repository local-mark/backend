import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const smtpTransport = nodemailer.createTransport({
  pool: true,
  maxConnections: 1,
  service: process.env.NAVER_SERVICE,
  host: process.env.NAVER_HOST,
  port: process.env.NAVER_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NAVER_EMAIL,
    pass: process.env.NAVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
