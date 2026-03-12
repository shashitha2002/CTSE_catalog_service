import type { Request, Response } from "express";
import {Book, type IBook} from "../models/Book.js";
import {isAdmin} from "../services/userServiceClient.js";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, category, price, stockCount, createdBy } = req.body;
    console.log(title, author, category, price, stockCount, createdBy);
    const adminCheck = await isAdmin(createdBy)
    console.log("adminCheck", adminCheck)
    if (!adminCheck) {
      return res.status(403).json({ message: "Only admins can update books" });
    }

    //checking for duplicates
    const existingBook = await Book.findOne(
      { title: title },
      { author: author },
      { category: category },
    );

    if (existingBook) {
      return res.status(400).send({ message: "Book already exists" });
    }

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
    return res
      .status(201)
      .json({ message: "Book added!", bookId: newBook._id });
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

    const matches = book.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2]!, "base64");

    res.set("Content-Type", type);
    res.set("Cache-Control", "public, max-age=86400");

    // 3. Send the binary data
    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving image" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      console.log("book details", {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        category: book.category,
        imageLink: `${req.protocol}://${req.get("host")}/api/books/image/${book._id}`,
      });
      return res.json({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        category: book.category,
        imageLink: `${req.protocol}://${req.get("host")}/api/books/image/${book._id}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book from catalog" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    console.log("updated information", req.body);

    const existingBook : IBook | null = await Book.findById(req.params.id)

    if(!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const adminCheck = await isAdmin(existingBook.createdBy)
    console.log("adminCheck", adminCheck)

    if (!adminCheck) {
      return res.status(403).json({ message: "Only admins can update books" });
    }

    const updateData: any = { ...req.body };

    //Remove all the empty fields
    Object.keys(updateData).forEach(key => {
      if(updateData[key] === '') {
        delete updateData[key];
      }
    })

    if (req.body.price) {
      updateData.price = Number(req.body.price);
    }

    if (req.body.stockCount) {
      updateData.stockCount = Number(req.body.stockCount);
    }

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      updateData.imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: 'after' }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: `Book (${req.params.id}) updated successfully`,
      book: updatedBook,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book : IBook | null = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      const adminCheck = await isAdmin(book.createdBy)
      console.log("adminCheck", adminCheck)

      if (!adminCheck) {
        return res.status(403).json({ message: "Only admins can update books" });
      }
      const DeletedBook = await Book.findByIdAndDelete(req.params.id);
      if (DeletedBook) {
        res
          .status(200)
          .json({ message: `Book ${DeletedBook.title} deleted successfully` });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Deleting book", error: error });
  }
};

export const getBooksByCategory = async (req: Request, res: Response) => {
  try{
    const category = req.params.category;

    const books = await Book.find({category : category})

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in this category" });
    }

    res.status(200).json({message : `books of category ${category}`, data: books});

  }catch(error){
    console.error(error);
    res.status(500).json({ message: "Error Receiving books by category", error: error });
  }
}