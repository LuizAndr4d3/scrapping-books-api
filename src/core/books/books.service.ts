import {Injectable} from "@nestjs/common";
import { getBooksData, getBooksDataByCategory, getCategoryList } from "../scraper/books.scrapper";
import { Book, BooksData, Category, CategoryList } from "./books.interface";

@Injectable()
export class BooksService {
    async getBooks(page?: number): Promise<BooksData> {
        return getBooksData(page);
    }

    async getBooksByCategory(name?: string, id?: number, page?: number): Promise<BooksData> {
        return getBooksDataByCategory(name, id, page);
    }

    async getCategories(): Promise<CategoryList> {
        return getCategoryList();
    }
    
}
