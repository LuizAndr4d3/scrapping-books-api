import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { getBooksData, getBooksDataByCategory, getCategoryList } from "../scraper/books.scrapper";


@Controller('books')
export class BooksController {
    @Get()
    async getBooks(@Query('page') page?: string) {
        const pageNumber = page ? Number(page) : undefined;
        return getBooksData(pageNumber);
    }

    @Get('category')
    async getBooksByCategory(@Query('name') name?: string, @Query('id') id?: string, @Query('page') page?: string) {
        if(!name && !id) throw new BadRequestException('Name or id is required');
        try{
            const idNumber = id ? Number(id) : undefined;
            const pageNumber = page ? Number(page) : undefined;
            return getBooksDataByCategory(name, idNumber, pageNumber);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
        
    }

    @Get('categories')
    async getCategories(){
        return getCategoryList();
    }
}