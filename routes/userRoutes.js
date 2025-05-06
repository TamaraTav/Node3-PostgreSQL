import express from 'express';
import { uploadProfilePicture } from "../middleware/uploadFile.js";
const router = express.Router();
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    signup,
    login,
    forgotPassword,
    resetPassword,
    uploadProfilePicture
} from '../controllers/userController.js';

router.post('/', createUser);
router.get('/', getUsers);

router.post('/signup', signup);
router.post('/login', login);

router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/upload-profile-picture/:id', uploadProfilePicture.single('profilePicture'), uploadProfilePicture);



export default router;
