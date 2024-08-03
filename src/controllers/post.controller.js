
import { response } from "express";
import { path } from "path";
import { addPostInfo } from '../services/post.service'
import { StatusCodes } from 'http-status-codes';
import { status } from "../../config/response.status";
import { createPost, deletePostById, getPostDetail, getPosts, updatePostDetail } from "../services/post.service";
import { removeImageById, uploadFileToS3AndSave } from "../services/image.service";


export const addPost = async(req,res,next)=>{
  await addPostInfo(req.body)
  return res.send(StatusCodes.OK)
}

// 커뮤니티 게시글 전체 및 카테고리별 게시글 목록 조회
export const posts = async(req, res) => {

        const querys = req.query;
        console.log(querys);

        const category = querys.category;
        console.log(category);
        const page = parseInt(querys.page);

        res.send(response(status.SUCCESS, await getPosts(category, page)));

}

export const uploadPost = async(req, res) => {

        try {
                console.log("body: ", req.body);
                const { userId, title, content, category, imageId } = req.body;
                const files = req.files;

                const postId = await createPost({ userId, title, content, category, imageId });
                
                const imageUrls = [];
                for (const file of files) {
                        const filePath = path.join(file.destination, file.filename);
                        const imageUrl = await uploadFileToS3AndSave(postId, filePath);
                        imageUrls.push(imageUrl);

                        fs.unlinkSync(filePath);
                }

                res.send(response(status.SUCCESS, imageUrls));
                
        } catch (error) {
                throw new Error(`오류 발생: ${error.message}`);
        }

}

export const postDetail = async(req, res, next) => {
        
        console.log("게시글 상세 조회 요청");
        const params = req.params;
        console.log("params(postId): ", params);

        return res.send(response(status.SUCCESS, await getPostDetail(params)));

}

export const modifyPost = async(req, res) => {

        console.log("게시글 수정 요청");
        const params = req.params;
        console.log("params(postId): ", params);
        
        const postId = req.params.id;
        console.log("req.body: ", req.body);
        const {title, content, category, thumbnailId, deleteImageIds} = req.body;
        const newImages = req.files;

        try {
                // 1. 게시글 내용 업데이트
                await updatePostDetail({postId, title, content, category, thumbnailId});

                // 2. 삭제한 이미지 처리
                if (deleteImageIds && deleteImageIds.length > 0) {
                        for (const imageId of deleteImageIds) {
                            await removeImageById(imageId);
                        }
                }
                // 3. 새로 추가한 이미지 처리
        
                const newImageUrls = [];
                if (newImages && newImages.length > 0) {
                    for (const file of newImages) {
                        console.log("file.path: ", file.path);
                        const imageUrl = await uploadFileToS3AndSave(file.path, postId);
                        newImageUrls.push(imageUrl);
                    }
                }

                res.send(response(status.SUCCESS, newImageUrls));
                
        } catch (error) {
                throw new Error(`오류 발생: ${error.message}`);
        }

}

export const removePost = async(req, res) => {
        console.log("게시글 삭제 요청");
        const params = req.params;
        console.log("params(postId): ", params);

        return res.send(response(status.SUCCESS, await deletePostById(params)));
}

