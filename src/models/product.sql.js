export const confirmBrand =
  "SELECT EXISTS(SELECT 1 FROM brand WHERE id = ?) as isExistBrand;";
export const insertProductSql =
  "INSERT INTO product(brand_id, name, thumbnail_url, price, discount_rate, delivery_fee, description, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?);";
export const insertCategorySql =
  "INSERT INTO product_category(product_id, category_id) VALUES(?, ?);";
export const insertColorSql =
  "INSERT INTO color(product_id, name, hex_code) VALUES(?, ?, ?);";
export const insertSizeSql = "INSERT INTO size(product_id, size) VALUES(?, ?);";

export const getProductById = "SELECT * FROM product WHERE id = ?;";
export const getColorByProductId = "SELECT * FROM color WHERE product_id = ?;";
export const getSizeByProductId = "SELECT * FROM size WHERE product_id = ?;";

export const confirmProduct =
  "SELECT EXISTS(SELECT 1 FROM product WHERE id = ?) as isExistProduct;";
export const updateProductSql =
  "UPDATE product SET name = ?, thumbnail_url = ?, price = ?, discount_rate = ?, delivery_fee = ?, description = ?, status = ? WHERE id = ?;";
export const updateCategorySql =
  "UPDATE product_category SET category_id = ? WHERE product_id = ?";
export const deleteColorSql = "DELETE FROM color WHERE product_id = ?;";
export const deleteSizeSql = "DELETE FROM size WHERE product_id = ?;";

export const deleteProductSql = "DELETE FROM product WHERE id = ?;";
