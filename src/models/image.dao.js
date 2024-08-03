import { confirmImage, confirmImageByPostId, deleteImgFileById, deleteImgsFileByPostId, getImageFileById, getImageFilesByPostId, getImageUrlById, getImagesUrlByPostId, saveImgeFileByPostId } from './image.query';
import { status } from '../../config/response.status';

export const saveImageByPostId = async (postId, filename) => {

    try {

        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmImage, imageId);

        if(confirm[0].isExistImage) {
            conn.release();
            return -1;
        }

        const [result] = await pool.query(saveImgeFileByPostId, [postId, filename]);

        conn.release();

        return result[0].insertId;

    } catch (error) {
        throw new BaseError(status.BAD_REQUEST);
    }
    
}

// DB 에서 이미지 아이디에 해당하는 이미지 파일 이름 조회
export const getImageById = async (imageId) => {

    try {

        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmImage, imageId);

        if(!confirm[0].isExistImage) {
            conn.release();
            return -1;
        }

        const [result] = await pool.query(getImageFileById, imageId);
        
        conn.release();

        return result[0].filename;
        
    } catch (error) {
        throw new BaseError(status.BAD_REQUEST);
    }

}

// DB 에서 해당 게시글의 이미지 정보 조회
export const getImagesByPostId = async (postId) => {

    try {

        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmImage, imageId);

        if(!confirm[0].isExistImage) {
            conn.release();
            return -1;
        }

        const [images] = await pool.query(getImageFilesByPostId, postId);
        
        conn.release();

               // 이미지 ID와 파일명을 포함한 객체 배열로 반환
        return images.map(image => ({
                id: image.id,
                filename: image.filename
        }));

    }catch (err) {
        throw new BaseError(status.BAD_REQUEST);
    }
    
}

export const deleteImageById = async (imageId) => {

    try {

        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmImage, imageId);

        if(!confirm[0].isExistImage) {
            conn.release();
            return -1;
        }

        const [result] = await pool.query(deleteImgFileById, imageId);

        return result[0].affectedRows;
        
    } catch (error) {
        throw new BaseError(status.BAD_REQUEST);
    }

}

export const deleteImageByPostId = async (postId, filename) => {

    try {

        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmImageByPostId, postId);

        if(!confirm.isExistImageByPostId) {
            conn.release();
            return -1;
        }

        const [result] = await pool.query(deleteImgsFileByPostId, postId);

        return result[0].affectedRows;

    } catch (error) {
        throw new BaseError(status.BAD_REQUEST);

    }

}