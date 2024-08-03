import { status } from "../../config/response.status";
import { postDetailResponseDTO } from "../dtos/post.dto";
import { deletePost, updatePost, addPost, getPreviewPostDetail, getPreviewPosts, getPreviewPostsByCategory } from "../models/post.dao";
import { postsResponseDTO } from "../dtos/post.dto"
import { deleteImageByPostId, getImageById, getImagesByPostId } from "../models/image.dao";
import { addPost } from '../models/post.dao'

export const addPostInfo =async (body) =>{
  const { userId, category, title, image, type, content} = body;
  console.log(userId)

  const result = await addPost(userId, category, title, image, type, content);
  return result
}


export const getPosts = async(category, page) => {

    if(category) {
        return postsResponseDTO(await getPreviewPostsByCategory(category, page));
    } else {
        return postsResponseDTO(await getPreviewPosts(page));
    }

}

export const getPostDetail = async(postId) => {

    const postDetail = await getPreviewPostDetail(postId);
    const imagefileNames = [];
    imagefileNames = await getImagesByPostId(postId);

    return postDetailResponseDTO(postDetail, imagefileNames); 
}


export const createPost = async({ userId, title, content, category, imageId }) => {
  
    let thumnail_filename = null;

    // imageId가 null이 아니고, 유효한 값일 때만 썸네일 파일명을 가져옴
    if (imageId !== null && imageId !== -1) {
        thumnail_filename = await getImageById(imageId);
    }
 
    const postId = await addPost({
        "userId": userId,
        "title": title,
        "content": content,
        "category": category,
        "thumnail_filename": thumnail_filename //null 이 될 수 있음. (이미지 첨부를 아무것도 하지 않았을 때)
    })

}

export const updatePostDetail = async({postId, title, content, category, thumbnailId}) => {

    const thumbnail_filename = getImageById(thumbnailId);

    const updatePostData = await updatePost({postId, title, content, category, thumbnail_filename});

    if(updatePostData == -1) {
        throw new BaseError(status.POST_NOT_FOUND);
    } else {
        return postDetailResponseDTO(await updatePost(postId));
    }
}

export const deletePostById = async(postId) => {

    const deleteResult = await deletePost(postId);

    if (deleteResult == -1) {
        throw new BaseError(sta.PRODUCT_NOT_EXIST);
    } else {

        await deleteImageByPostId(postId);
        
        return { isSuccess: true, message: "게시글이 성공적으로 삭제되었습니다." };
    }

}