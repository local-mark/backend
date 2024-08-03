import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성기

const uploadDir = path.join(__dirname, '../../uploads/images');

// Multer 설정 (임시 파일 저장)
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage: storage });


export const deleteImageFileIndir = async(filename) => {

    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    } else {
        throw new Error(`파일을 찾을 수 없습니다: ${filename}`);
    }

}