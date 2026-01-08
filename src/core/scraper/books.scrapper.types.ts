export type Book = {
    title: string;
    image: string;
    price: number;
    stock_availability: boolean;
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