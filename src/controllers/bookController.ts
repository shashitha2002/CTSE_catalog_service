import type { Request, Response } from "express";
import { Book } from "../models/Book.js";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, category, price, stockCount, createdBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    // Convert the buffer to a Base64 string
    const base64Image = req.file.buffer.toString("base64");

    // Format it so the browser knows it's an image
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const newBook = new Book({
      title,
      author,
      category,
      price: Number(price),
      stockCount: Number(stockCount),
      createdBy,
      imageUrl, // Save the generated string to DB
    });

    await newBook.save();
    res.status(201).json({ message: "Book added!", bookId: newBook._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find().select("-__v");
    const bookWithLinks = books.map((book) => {
      return {
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        category: book.category,
        imageLink: `${req.protocol}://${req.get("host")}/api/books/image/${book._id}`,
      };
    });
    res.status(200).json(bookWithLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books from catalog" });
  }
};

export const getBookImage = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || !book.imageUrl) {
      return res.status(404).json({ message: "Image not found" });
    }

    // 1. Extract the base64 data and the mime type
    // Base64 format: "data:image/png;base64,iVBORw..."
    const matches = book.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const type = matches[1]; // e.g., 'image/jpeg'
    const buffer = Buffer.from(matches[2]!, 'base64');

    // 2. Set the correct header so the browser knows it's an image
    res.set('Content-Type', type);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day for speed

    // 3. Send the binary data
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving image" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book from catalog" });
  }
};
