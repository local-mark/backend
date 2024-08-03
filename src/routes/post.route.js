import express from 'express';
import asyncHandler from 'express-async-handler';
import { addPost } from '../controllers/post.controller';
import { modifyPost, postDetail, posts, removePost, uploadPost } from '../controllers/post.controller';
import { upload } from '../proviers/image.provider';

export const postRouter = express.Router({mergeParams: true});
export const postsRouter = express.Router({mergeParams: true});

postRouter.post('/signin', asyncHandler(addPost));
postsRouter.get('/', asyncHandler(posts));
postsRouter.post('/', upload.array('images', 10), asyncHandler(uploadPost));
postsRouter.get('/:postId', asyncHandler(postDetail));
postsRouter.patch('/:postId', upload.array('images', 10), asyncHandler(modifyPost));
postsRouter.delete('/:postId', asyncHandler(removePost));

