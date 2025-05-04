import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = './uploads';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {  //cb არის call back ფუნქცია
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); //ეს ბიბლიოთეკა ჩაშენებულია ნოდში
        //და ეს მეთოდი აკეთებს იმას რომ ფაილის ორიგინალი სახელიდან იღებს გაფართოებას და ადგავს uniqueSuffix-s
    },
});

const filterFiles = (req, files, cb) => {
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image types allowed !!!'));
    }
};

const upload = multer({
    storage: storage,
    filterFiles: filterFiles,
    limits: {
        fileSize: 1024 * 1024 * 5,  //5MB
    }
});

export default upload;
