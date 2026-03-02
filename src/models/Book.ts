import { Schema, model, Document } from 'mongoose';

export enum BookCategory {
    Romance = "Romance",
    Thriller = "Thriller",
    Fantasy = "Fantasy",
    Science = "Science",
    Horror = "Horror",
    SelfHelp = "Self-help",
    Health = "Health",
    Cookbooks = "Cookbooks",
    Poetry = "Poetry",
}

export interface IBook extends Document {
    title: string;
    author: string;
    category: BookCategory;
    price: number;
    stockCount: number;
    createdBy: string; //created user ID
    imageUrl: string;
}

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, enum: Object.values(BookCategory), required: true },
    price: { type: Number, required: true },
    stockCount: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
    imageUrl: { type: String, required: true },
});

export const Book = model<IBook>('Book', bookSchema);