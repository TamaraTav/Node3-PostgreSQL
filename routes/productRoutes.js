import express from 'express';
import {uploadExcel, uploadProductImages} from "../middleware/uploadFile.js";

const router = express.Router();
import {
    getProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategoryStats,
    buyProduct,
    uploadProductsExcel,
    updateProductImages
} from "../controllers/productController.js";

import {auth, isAdmin} from "../middleware/auth.js"; //ეს მიდლვეარი მოგვაქვს და ვიყენებთ ავტორიზაციას ყიდვამდე


//Product routes
router.get('/', getProducts);
router.get('/category-stats', getCategoryStats);
router.get('/:id', getOneProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);
router.post('/buyProduct/:id', auth, buyProduct); //ჯერ auth და მერე buy, დაცული როუტი
router.post('/upload-product-excel', uploadExcel.single('products'), uploadProductsExcel);
router.post('/update-product-images/:id', uploadProductImages.array('images', 5), updateProductImages);



export default router;


