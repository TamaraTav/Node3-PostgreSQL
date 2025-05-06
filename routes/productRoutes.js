import express from 'express';
const router = express.Router();
import {
    getProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategoryStats,
    buyProduct,
    uploadProductsExcel
} from "../controllers/productController.js";

import {auth, isAdmin} from "../middleware/auth.js"; //ეს მიდლვეარი მოგვაქვს და ვიყენებთ ავტორიზაციას ყიდვამდე
import upload from "../middleware/uploadFile.js";


//Product routes
router.get('/', getProducts);
router.get('/category-stats', getCategoryStats);
router.get('/:id', getOneProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);
router.post('/buyProduct/:id', auth, buyProduct); //ჯერ auth და მერე buy, დაცული როუტი
router.post('/upload-product-excel', upload.single('products'), uploadProductsExcel);
export default router;


