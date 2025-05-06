import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = './uploads';

//////ეს სტორიჯი საერთოა ყველა აფლოადისთის
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

///////სურათის აფლოადისთვის
const filterProfilePicture = (req, files, cb) => {
    const allowedFileTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image types allowed !!!'));
    }
};

const uploadProfilePicture = multer({
    storage: storage,
    filterFiles: filterProfilePicture,
    limits: {
        fileSize: 1024 * 1024 * 5,  //5MB
    }
});


/////////// ექსელის აფლოადისთვის
const filterExcels = (req, files, cb) => {
    const allowedFileTypes = [
        'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/x-dos_ms_excel'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image types allowed !!!'));
    }
};

const uploadExcel = multer({
    storage: storage,
    filterFiles: filterExcels,
    limits: {
        fileSize: 1024 * 1024 * 10,  //10MB
    }
});

//////// პროდუქტის ბევრი ფოტოების აფლოადისთვის
const filterProductImages = (req, files, cb) => {
    const allowedFileTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image types allowed !!!'));
    }
};

const uploadProductImages = multer({
    storage: storage,
    filterFiles: filterProductImages,
    limits: {
        fileSize: 1024 * 1024 * 10,  //10MB
    }
});



export  {uploadProfilePicture, uploadExcel, uploadProductImages};
