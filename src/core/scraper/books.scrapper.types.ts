export type Book = {
    id: number;
    title: string;
    url: string;
    image: string;
    price: number;
    stock_availability: boolean;
}

export type DetailedBook = Book & {
    upc: string;
    product_type: string;
    tax: number;
    stock_quantity: number;
    category: string;
    reviews_count: number;
    description: string;
}

export type BooksData = {
    currentPage: number;
    nextPage: number | null;
    totalPages: number;
    totalBooks: number;
    shownBooks: number;
    books: Book[];
}

export type Category = {
    id: number;
    name: string;
    url: string;
}

export type CategoryList = {
    categoryList: Category[];
}