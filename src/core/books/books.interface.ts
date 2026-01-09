export interface Book {
    id: number;
    title: string;
    url: string;
    image: string;
    price: number;
    stock_availability: boolean;
}

export interface DetailedBook extends Book {
    upc: string;
    product_type: string;
    tax: number;
    stock_quantity: number;
    category: string;
    reviews_count: number;
    description: string;
}

export interface BooksData {
    currentPage: number;
    nextPage: number | null;
    totalPages: number;
    totalBooks: number;
    shownBooks: number;
    books: Book[];
}

export interface Category {
    id: number;
    name: string;
    url: string;
}

export interface CategoryList {
    categoryList: Category[];
}