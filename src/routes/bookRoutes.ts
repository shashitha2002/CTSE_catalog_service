import { Router } from 'express';
import { createBook, getAllBooks, getBookById, getBookImage } from '../controllers/bookController.js';
import { upload } from '../middleware/upload.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protected route: Only Admins can add books + must upload an image
/* router.post('/', isAdmin, upload.single('image'), createBook); */
router.post('/', upload.single('image'), createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.get('/image/:id', getBookImage);
export default router;