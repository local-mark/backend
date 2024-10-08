export const confirmLoginId =
  "SELECT EXISTS(SELECT 1 FROM User WHERE loginId = ?) AS isExistLoginId";

export const selectUserSql =
  "SELECT id, loginId, password, nickname, type, status, inactive_date, is_brand_registered FROM User WHERE loginId = ?";

export const updateTokenSql = "UPDATE User SET token = ? WHERE id = ?";

export const confirmToken =
  "SELECT EXISTS(SELECT 1 FROM User WHERE id = ? AND token = ?) as isExistToken;";

export const selectTokenSql = "SELECT token FROM User WHERE id = ?;";
