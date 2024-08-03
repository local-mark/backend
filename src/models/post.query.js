export const insertPost=
"INSERT INTO post (userId, category, title, thumnail_filename, content)" +
"VALUES (?, ?, ?, ?, ?)"

export const getPostsByCategory = 
"SELECT * FROM post" +
"WHERE category = ?" +
"LIMIT ? OFFSET ?;";

export const getPosts = 
"SELECT * FROM post" +
"LIMIT ? OFFSET ?;";

export const getPostDetail = 
"SELECT * FROM post" +
"WHERE id = ?;";

export const updatePostSql = 
"UPDATE post SET title = ?, content = ?, category = ?, thumbnail_filename = ?" +
"WHERE id = ?;";

export const deletePostSql =
"DELETE FROM post WHERE id = ?;";

export const confirmPost =
"SELECT EXISTS(SELECT 1 FROM post WHERE id = ?) as isExistPost;";