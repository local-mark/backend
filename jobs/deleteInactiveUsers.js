import cron from "node-cron";
import { status } from "../config/baseResponseStatus.js";
import { BaseError } from "../config/error.js";
import { deleteUserSql } from "../src/models/user.sql.js";
import pool from "../config/database.js";

// 새벽 2시
cron.schedule("0 2 * * *", async () => {
  console.log("7일 지난 유저 삭제");

  try {
    const conn = await pool.getConnection();

    const [result] = await pool.query(deleteUserSql);

    conn.release();
    return result.affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
});
