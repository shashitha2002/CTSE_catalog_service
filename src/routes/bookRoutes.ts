import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getBookImage, getBooksByCategory,
  updateBook,
} from "../controllers/bookController.js";
import { upload } from "../middleware/upload.js";
import {authenticate} from "../middleware/authMiddleware.js";

const router = Router();

/**
 *  @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book (Admin only)
 *     tags: [Books]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, author, category, price, stockCount, createdBy, image]
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stockCount:
 *                 type: integer
 *               createdBy:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Book created
 *       403:
 *         description: Not an admin
 */
router.post("/", authenticate, upload.single("image"), createBook);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get("/", authenticate, getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get("/:id", authenticate, getBookById);

/**
 * @swagger
 * /api/books/image/{id}:
 *   get:
 *     summary: Get a book image by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book image
 *       400:
 *         description: Invalid image format
 *       404:
 *         description: Book image not found
 */
router.get("/image/:id", authenticate, getBookImage);

router.get("/category/:category", authenticate, getBooksByCategory);

/**
 * @swagger
 * /api/books/update/{id}:
 *   patch:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stockCount:
 *                 type: integer
 *               createdBy:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: book update failed
 *       404:
 *         description: Book not found
 */
router.patch("/update/:id", authenticate, upload.single("image"), updateBook);

/**
 * @swagger
 * /api/books/delete/{id}:
 *   delete:
 *     summary: Delete a Book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book is Deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete("/delete/:id", authenticate, deleteBook);
export default router;
