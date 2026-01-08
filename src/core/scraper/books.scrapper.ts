import { BOOKS_SCRAPPER_CONFIG } from "./books.scrapper.config";
import { Book, BooksData, CategoryList, Category } from "./books.scrapper.types";
import * as cheerio from "cheerio";
import { ItemsService } from "./items/items.service";
import axios from 'axios';

const itemsService = new ItemsService();

async function getBooksFromPage(element: cheerio.Root, page?:number): Promise<BooksData> {
    const $ = element;
    const $allBooks = $('article.product_pod');
    const Books: Book[] = new Array($allBooks.length);
    $allBooks.each((index, element) => {
        const book = $(element);
        const title = book.find('h3 a').attr('title') ?? '';
        const price = Number(book.find('p.price_color').text().replace('£', '')) ?? 0;
        const image = `${BOOKS_SCRAPPER_CONFIG.URL}${book.find('div.image_container a img').attr('src')!.replace('../', '')}`;
        const stock_availability = book.find('p.instock.availability').text().trim() === 'In stock' ? true : false;

        
        Books[index] = {
            title,
            price,
            image,
            stock_availability,
        }
    })

    const strongElements = $('form.form-horizontal strong').toArray();
    const bookCounts = strongElements.map(el => Number($(el).text().trim())).filter(n => !isNaN(n));
    
    const pagerText = $('ul.pager li.current').text().trim();
    const totalPages = pagerText ? Number(pagerText.split(' ')[3]) || 1 : 1;
    const currentPage = Number(page ?? 1);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    
    const totalBooks = bookCounts[0] || 0;
    const shownBooks = bookCounts.length >= 3 
        ? (bookCounts[2] - bookCounts[1] + 1) 
        : Books.length;

    return {
        currentPage,
        nextPage,
        totalPages,
        totalBooks, 
        shownBooks,
        books: Books,
    } as BooksData;
}

export const getBooksData = async (page?: number): Promise<BooksData> => {
    const response = await axios.get(`${BOOKS_SCRAPPER_CONFIG.URL}/catalogue/page-${page ?? 1}.html`);
    const $ = cheerio.load(response.data);
    return await getBooksFromPage($, page ?? 1);
}

export const getBooksDataByCategory = async (name?: string, id?: number, page?: number): Promise<BooksData> => {
    let category = await itemsService.getCategoryService(id, name);
    
    if(!category) {
        await getCategoryList(); 
        category = await itemsService.getCategoryService(id, name);
        if(!category) {
            throw new Error(`Category not found`);
        }
    }
    
    const response = await axios.get(category.url);
    const $ = cheerio.load(response.data);
    return await getBooksFromPage($, page ?? 1);
}

export const getCategoryList = async (): Promise<CategoryList> => {
    const response = await axios.get(`${BOOKS_SCRAPPER_CONFIG.URL}`);
    const $ = cheerio.load(response.data);
    const $categoryList = $('div.side_categories ul li ul a');
    const allCategories: Category[] = new Array($categoryList.length);
    $categoryList.each((index, element) => {
        const category = $(element);
        const categoryHref = category.attr('href');
        if (!categoryHref) return;
        
        const hrefParts = categoryHref.split('/');
        const categoryPart = hrefParts[3];
        const idMatch = categoryPart ? categoryPart.match(/_(\d+)$/) : null;
        const id = idMatch ? Number(idMatch[1]) : 0;
        
        const name = category.text().trim();
        const url = `${BOOKS_SCRAPPER_CONFIG.URL}${categoryHref}`;

        allCategories[index] = {
            id,
            name,
            url,
        }
    });
    
    allCategories.sort((a, b) => a.id - b.id);

    const items = await itemsService.getItemsService();
    if (JSON.stringify(items.categoryList) != JSON.stringify(allCategories)) {
        await itemsService.saveItemsService({ categoryList: allCategories });
    }

    return { categoryList: allCategories } as CategoryList;
}