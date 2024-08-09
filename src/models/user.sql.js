export const confirmLoginId = "SELECT EXISTS(SELECT 1 FROM User WHERE loginId = ?) AS isExistLoginId";

export const selectEmailSql = "SELECT email FROM User WHERE loginId = ?";

export const updateActiveUserSql =
  "UPDATE User SET token = NULL, status = 'INACTIVE', inactive_date = NOW() WHERE id = ?";

export const updateInactiveUserSql =
  "UPDATE User SET status = 'ACTIVE', inactive_date = NULL WHERE id = ?";


export const deleteUserSql =
  "DELETE FROM User WHERE inactive_date IS NOT NULL AND inactive_date < NOW() - INTERVAL 7 DAY";
