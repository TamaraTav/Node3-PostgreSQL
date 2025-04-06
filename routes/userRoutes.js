import express from 'express';
const router = express.Router();
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    signup,
} from '../controllers/userController.js';

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/signup', signup);


export default router;
