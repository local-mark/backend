import { pool } from '../../config/database.js';
import crypto from "crypto";
import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { smtpTransport } from "../../config/email.js";

import {
    confirmLoginId,
    selectEmailSql,
    updateActiveUserSql,
    updateInactiveUserSql
  } from "../models/user.sql.js";

export const findByID = async(userId) => {
    const sql = `SELECT * FROM User WHERE id = ?`;
    try {
        const [results] = await pool.query(sql, [userId]);
        return results[0];
    } catch (error) {
        throw error;
    }
}

export const findByLoginID = async (loginId) => {
    const sql = `SELECT * FROM User WHERE loginId = ?`;
    try {
        const [results] = await pool.query(sql, [loginId]);
        return results[0];
    } catch (error) {
        throw error;
    }
};


export const findByEmail = async (email) => {
    const sql = `SELECT * FROM User WHERE email = ?`;
    try{
        const [results] = await pool.query(sql, [email]);
        return results[0];
    } catch (error) {
        throw error;
    }
};

export const createUser = async (userData, hashedPassword, type) => {
    const sql = `
        INSERT INTO User (loginId, email, password, nickname, type, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [userData.loginId, userData.email, hashedPassword, userData.nickname, type, userData.status];
    try{
        const [results] = await pool.query(sql, values);
        console.log(results[0]);
        return results[0];
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    const sql = `
        UPDATE User SET
            loginId = ?, email = ?, nickname = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    const values = [
        userData.loginId, userData.email, userData.nickname, userId
    ];
    try{
        const [results] = await pool.query(sql, values);
        return results[0];
    } catch (error) {
        console.error('SQL Error:', error);
        throw error;
    }
};
export const updatePassword = async(userId, newHashedPassword) =>{
    const sql = `
        UPDATE User SET
            password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    const values = [
        newHashedPassword, userId
    ];
    try{
        const [results] = await pool.query(sql, values);
        console.log('3333',results)
        return results;
    } catch(error) {
        console.error('SQL Error:', error);
        throw error;
    }
}

export const getUsernameByEmail = async (email) => {
    const sql=`
        SELECT id, nickname, name FROM User WHERE email = ?
    `
    try{
        const results = await pool.query(sql, [email]);
        return results[0]
    } catch(error){
        console.error('SQL Error:', error);
        throw error;
    }
};

export const getOrdersByID = async (userId) => {
    const sql = `
        SELECT id FROM Orders WHERE user_id = ? AND status = "COMPLETE"
    `
    try{
        const [results] = await pool.query(sql, [userId]);
        if(results.length>0){
            const ids = results.map(order => order.id);
            return ids;
        }
        else{
            return null;
        }
    }catch(error){
        throw(error)
    }
};

export const getOrderItemNumberByIDs = async (ids) => {
    const placeholders = ids.ma(()=>'?').join(',');
    const sql = `SELECT product_id FROM Order_Item WHERE order_id IN (${placeholders})`;
    try{
        const [results] = await pool.query(sql, ids)
        if (results.length > 0) {
            const ids = results.map(order => order.product_id);
            return ids;
        }
        else{
            return(null);
        }
    }catch(error){
        throw(error);
    }
};

export const getOrderItems = async (itemNumber) => {
    const placeholders = itemNumber.map(() => '?').join(',');
    const sql = `SELECT * FROM Product WHERE id IN (${placeholders})`;
    try{
        const [results] = await pool.query(sql, itemNumber)
        return results;
    } catch(error){
        throw(error);
    }
};

export const verifyEmail = async (loginId, email) => {  
    try {
      const conn = await pool.getConnection();

      const [confirm] = await pool.query(confirmLoginId, [loginId]);
      if (!confirm[0].isExistLoginId) {
        conn.release();
        return -1;
      }

      const [user] = await pool.query(selectEmailSql, [loginId]);
      if (user[0].email != email) {
        conn.release();
        return -2;
      }
  
      conn.release();
      return email;
    } catch (err) {
      throw new BaseError(status.PARAMETER_IS_WRONG);
    }
  };
  
export const resetPasswordByEmail = async (email) => {
    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); //1시간 이후 만료
  
    // 아직 안 정해짐..
    const mailOptions = {
      from: process.env.NAVER_EMAIL, // 발신자 이메일 주소.
      to: email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
      subject: "로컬마크 비밀번호 변경",
      html: `<p>비밀번호 변경 링크입니다.</p>
      <p> <a href="http://localhost:3000/verify-email/?email=${email}?token=${token}">Verify email</a></p>
      <p>이 링크는 ${expires}까지 유효합니다.</p>`,
    };
  
    try {
      smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
          smtpTransport.close(); // 전송 종료
          conn.release(); // 연결 종료
          return -1;
        } else {
          smtpTransport.close(); // 전송 종료
          conn.release(); // 연결 종료
          console.log(info.response);
          return info.response;
        }
      });
    } catch (err) {
      smtpTransport.close();
      throw new BaseError(status.EMAIL_SENDING_FAILED);
    }
};
  
export const deleteUserById = async (userId) => {
    try {
        const conn = await pool.getConnection();

        // ACTIVE한 유저의 상태를 바꿈, inactive_date 설정
        const [result] = await pool.query(updateActiveUserSql, [userId]);
    
        conn.release();
        return result.affectedRows;
        } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    };
};
  
export const restoreUserById = async (userId) => {
    try {
        const conn = await pool.getConnection();
    
        // INACTIVE한 유저의 상태를 바꿈
        const [result] = await pool.query(updateInactiveUserSql, [userId]);
    
        conn.release();
        return result.affectedRows;
        } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    };
};
  