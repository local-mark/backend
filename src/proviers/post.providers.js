import {  postsResponseDTO } from "../dtos/post.dto"
import {  getPreviewPosts, getPreviewPostsByCategory, updatePost } from "../models/post.dao"

export const getPosts = async(category, page) => {

    if(category) {
        return postsResponseDTO(await getPreviewPostsByCategory(category, page));
    } else {
        return postsResponseDTO(await getPreviewPosts(page));
    }

}

