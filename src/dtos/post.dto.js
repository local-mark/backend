export const addPostResponseDTO = ({post, images}) => {
    return { post, images };
}

export const modifyPostResponseDTO = ({post, images}) => {
    return { post, images };
}

export const postsResponseDTO = (posts, totalPage) => {
    const postsData = [];

    for (let i = 0; i < posts.length; i++) {

        postsData.push({
            "postId": posts[i].id,
            "userId": posts[i].user_id,
            "category": posts[i].category,
            "title": posts[i].title,
            "thumbnailFilename": posts[i].thumbnail_filename,
            "content": posts[i].content,
            "createdAt": formatDate(posts[i].created_at),
            "modifiedAt": formatDate(posts[i].updated_at),
            "commentNum":posts[i].commentNum,
            "likeNum": posts[i].likeNum,
        })
    }

    console.log(totalPage);

    return {
        "postData": postsData,
        "totalPage": totalPage
    };

}


export const postDetailResponseDTO = (post, images, commentNum, likeNum, brandInfo, userInfo) => {
    console.log("userInfo:", userInfo)
    console.log("images:", images);
    post[0].created_at = formatDate(post[0].created_at);

    
    const imagesData = [];

    for (let i = 0; i < images.length; i++) {
        imagesData.push({
            "filename": images[i].filename
        }) 
    }
    const author = userInfo ? {
        id: userInfo.id,
        name: userInfo.loginId,
        email: userInfo.email
        //Todo: 유저 프로필 정보 추가
    }: {};

    const filteredBrandInfo = brandInfo ? {
        brandName: brandInfo.brand_name,
        brandUrl: brandInfo.brand_url,
        description: brandInfo.description
    } : {};

    return {
        "postId": post[0].id,
        "category": post[0].category,
        "title": post[0].title,
        "thumbnailFilename": post[0].thumbnailFilename,
        "content": post[0].content,
        "createdAt": post[0].created_at,
        "commentNum": commentNum[0].commentNum,
        "likeNum": likeNum[0].likeNum,
        "imagesData": imagesData,
        "author":author,
        "brand": filteredBrandInfo
    };
}

const formatDate = (date) => {
    return new Intl.DateTimeFormat('kr').format(new Date(date)).replaceAll(" ", "").slice(0, -1);
}