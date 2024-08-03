import fs from 'fs';
import path from 'path';
import { deleteImageById, getImageById, saveImageByPostId } from "../models/image.dao"
import { deleteImageFileIndir } from '../proviers/image.provider';

// 게시글 등록 시 이미지 등록
export const uploadFileToS3AndSave = async(postId, filePath) => {

    const filename = path.basename(filePath);
    console.log(filename);
    // 추후에 s3 업로드도 추가

    // 데이터 저장
    await saveImageByPostId(postId, filename);

    return filePath;

}

// 게시글 수정 시 이미지 하나 씩 지우기
export const removeImageById = async(imageId) => {

    const filename = getImageById(imageId);

    try {
        // 추후에 s3 에서도 삭제 메서드 추가 
        // await deleteFileFromS3(filename);
        
        await deleteImageFileIndir(filename); // 임시 디렉토리에 있는 파일 삭제
        await deleteImageById(imageId, filename); // DB 에 있는 이미지 삭제
        
    } catch (error) {
        throw new Error(`이미지 삭제 중 오류 발생: ${error.message}`);
    }
}

// 게시글 삭제 시 한 번에 이미지 지우기
export const removeImagesByPostId = async(postId) => {
    


    return '파일 삭제 성공';
}