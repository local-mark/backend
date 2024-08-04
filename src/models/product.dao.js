import { pool } from "../../config/database.js";
import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import {
  confirmBrand,
  insertProductSql,
  insertCategorySql,
  insertColorSql,
  insertSizeSql,
  getProductById,
  getColorByProductId,
  getSizeByProductId,
  confirmProduct,
  updateProductSql,
  updateCategorySql,
  deleteColorSql,
  deleteSizeSql,
  deleteProductSql,
} from "../models/product.sql";

export const addProduct = async (data) => {
  try {
    const conn = await pool.getConnection();

    const [confirm] = await pool.query(confirmBrand, data.brand_id);

    console.log(data.brand_id);
    if (!confirm[0].isExistBrand) {
      conn.release();
      return -1;
    }

    const result = await pool.query(insertProductSql, [
      data.brand_id,
      data.name,
      data.thumbnail_url,
      data.price,
      data.discount_rate,
      data.delivery_fee,
      data.description,
      data.status,
    ]);

    conn.release();
    return result[0].insertId;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const addCategoryToProduct = async (productId, categoryId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(insertCategorySql, [productId, categoryId]);

    conn.release();
    return result[0].insertId;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const addColorToProduct = async (productId, color) => {
  try {
    const conn = await pool.getConnection();

    const result = await conn.query(insertColorSql, [
      productId,
      color.name,
      color.hex_code,
    ]);

    conn.release();
    return result[0].insertId;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const addSizeToProduct = async (productId, size) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(insertSizeSql, [productId, size]);

    conn.release();
    return result[0].insertId;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const getProduct = async (productId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(getProductById, productId);

    if (result[0].length == 0) {
      return -1;
    }
    conn.release();
    return result[0];
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const getColor = async (productId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(getColorByProductId, productId);
    if (result[0].length == 0) {
      return -1;
    }
    conn.release();
    return result[0];
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const getSize = async (productId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(getSizeByProductId, productId);

    if (result[0].length == 0) {
      return -1;
    }
    conn.release();
    return result[0];
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const conn = await pool.getConnection();

    const [confirm] = await pool.query(confirmProduct, productId);

    if (!confirm[0].isExistProduct) {
      conn.release();
      return -1;
    }

    const result = await pool.query(updateProductSql, [
      data.name,
      data.thumbnail_url,
      data.price,
      data.discount_rate,
      data.delivery_fee,
      data.description,
      data.status,
      productId,
    ]);

    conn.release();
    return result[0].affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const setCategoryToProduct = async (productId, categoryId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(updateCategorySql, [productId, categoryId]);

    conn.release();
    return result[0].affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const deleteColorToProduct = async (productId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(deleteColorSql, productId);

    conn.release();
    return result[0].affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const deleteSizeToProduct = async (productId) => {
  try {
    const conn = await pool.getConnection();

    const result = await pool.query(deleteSizeSql, productId);

    conn.release();
    return result[0].affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const conn = await pool.getConnection();

    const [confirm] = await pool.query(confirmProduct, productId);

    if (!confirm[0].isExistProduct) {
      conn.release();
      return -1;
    }

    const result = await pool.query(deleteProductSql, productId);

    conn.release();
    return result[0].affectedRows;
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};
