# 📚 Scraping Books API

REST API developed with NestJS to perform web scraping of books from [Books To Scrape](https://books.toscrape.com/) website. The API allows you to search for books, filter by categories, and get detailed information about each book.

## 🚀 Technologies Used

- **NestJS** - Node.js framework for building efficient and scalable server-side applications
- **TypeScript** - JavaScript superset with static typing
- **Axios** - HTTP client for making requests
- **Cheerio** - Library for parsing HTML using jQuery-like syntax
- **Jest** - Testing framework

## 📋 Prerequisites

Before you begin, make sure you have installed:

- Node.js (version 18 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scraping-books-api
```

2. Install dependencies:
```bash
npm install
```

## ▶️ How to Run

### Development

To run the application in development mode (with hot-reload):

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

### Production

1. Build the project:
```bash
npm run build
```

2. Run the compiled project:
```bash
npm run start:prod
```

### Other Useful Commands

```bash
# Format code
npm run format

# Run lint
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📁 Project Structure

```
scraping-books-api/
├── src/
│   ├── core/
│   │   ├── books/
│   │   │   ├── books.controller.ts    # Route controller
│   │   │   ├── books.service.ts       # Service layer
│   │   │   └── books.interface.ts     # TypeScript interfaces
│   │   └── scraper/
│   │       ├── books.scrapper.ts      # Scraping logic
│   │       ├── books.scrapper.config.ts  # Configuration
│   │       ├── books.scrapper.types.ts   # TypeScript types
│   │       └── items/
│   │           ├── items.service.ts   # Category management service
│   │           └── categories.json    # Category cache
│   ├── app.module.ts                  # Main module
│   └── main.ts                        # Initialization file
├── test/                              # E2e tests
├── dist/                              # Compiled code
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. List Books

Returns a paginated list of books.

**GET** `/api/books`

**Query Parameters:**
- `page` (optional): Page number (default: 1)

**Example:**
```bash
GET http://localhost:3000/api/books?page=1
```

**Response:**
```json
{
  "currentPage": 1,
  "nextPage": 2,
  "totalPages": 50,
  "totalBooks": 1000,
  "shownBooks": 20,
  "books": [
    {
      "id": 1000,
      "title": "A Light in the Attic",
      "url": "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
      "price": 51.77,
      "image": "https://books.toscrape.com/media/cache/2c/da/2cdad67c44b002e7ead0cc35693c0e8b.jpg",
      "stock_availability": true
    }
  ]
}
```

### 2. Get Book Details by ID

Returns detailed information about a specific book.

**GET** `/api/book_details`

**Query Parameters:**
- `id` (required): Book ID

**Example:**
```bash
GET http://localhost:3000/api/book_details?id=1000
```

**Response:**
```json
{
  "id": 1000,
  "title": "A Light in the Attic",
  "url": "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
  "price": 51.77,
  "image": "https://books.toscrape.com/media/cache/2c/da/2cdad67c44b002e7ead0cc35693c0e8b.jpg",
  "stock_availability": true,
  "upc": "a897fe39b1053632",
  "product_type": "Books",
  "tax": 0,
  "stock_quantity": 22,
  "category": "Poetry",
  "reviews_count": 0,
  "description": "It's hard to imagine a world without A Light in the Attic..."
}
```

**Note:** This endpoint uses an optimized algorithm to calculate which page contains the book, making it very efficient even with 1000 books. The page is calculated using the formula: `Math.ceil((TotalBooks - BookID + 1) / BooksPerPage)` since books are displayed in descending order by ID.

### 3. List Books by Category

Returns a list of books filtered by category.

**GET** `/books/category`

**Query Parameters:**
- `id` (optional): Category ID
- `name` (optional): Category name
- `page` (optional): Page number

**Note:** You must provide either `id` or `name`.

**Examples:**
```bash
# Search by ID
GET http://localhost:3000/api/category?id=2

# Search by name
GET http://localhost:3000/api/category?name=Travel

# With pagination
GET http://localhost:3000/api/category?id=2&page=1
```

**Response:**
```json
{
  "currentPage": 1,
  "nextPage": null,
  "totalPages": 1,
  "totalBooks": 11,
  "shownBooks": 11,
  "books": [
    {
      "id": 45,
      "title": "It's Only the Himalayas",
      "url": "https://books.toscrape.com/catalogue/its-only-the-himalayas_45/index.html",
      "price": 45.17,
      "image": "https://books.toscrape.com/media/cache/ab/b3/abb3a3c65d1e8ef2eb0b4e4e6b2996e4.jpg",
      "stock_availability": true
    }
  ]
}
```

### 4. List Categories

Returns all available categories.

**GET** `/api/categories`

**Example:**
```bash
GET http://localhost:3000/api/categories
```

**Response:**
```json
{
  "categoryList": [
    {
      "id": 2,
      "name": "Travel",
      "url": "https://books.toscrape.com/catalogue/category/books/travel_2/index.html"
    },
    {
      "id": 3,
      "name": "Mystery",
      "url": "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html"
    }
  ]
}
```

## 📊 Data Structure

### Book
```typescript
{
  id: number;                 // Unique book ID (extracted from URL)
  title: string;              // Book title
  url: string;                // Full URL to book's detail page
  price: number;              // Price in British pounds
  image: string;              // Cover image URL
  stock_availability: boolean // Stock availability
}
```

### DetailedBook
```typescript
{
  // All fields from Book, plus:
  upc: string;                // Universal Product Code
  product_type: string;       // Product type (usually "Books")
  tax: number;                // Tax amount
  stock_quantity: number;     // Number of items in stock
  category: string;           // Book category name
  reviews_count: number;      // Number of reviews
  description: string;        // Book description
}
```

### BooksData
```typescript
{
  currentPage: number;        // Current page
  nextPage: number | null;    // Next page (null if none)
  totalPages: number;         // Total pages
  totalBooks: number;         // Total books
  shownBooks: number;         // Books shown on current page
  books: Book[];              // Array of books
}
```

### Category
```typescript
{
  id: number;                 // Unique category ID
  name: string;               // Category name
  url: string;                // Category page URL
}
```

### CategoryList
```typescript
{
  categoryList: Category[];   // Array of categories
}
```

## 🔧 Configuration

The base URL of the website can be configured in `src/core/scraper/books.scrapper.config.ts`:

```typescript
export const BOOKS_SCRAPPER_CONFIG = {
    URL: 'https://books.toscrape.com/',
} as const;
```

The application port can be configured through the `PORT` environment variable:

```bash
PORT=3001 npm run start:dev
```

## 💾 Category Cache

The API maintains a local cache of categories in the `src/core/scraper/items/categories.json` file. This file is automatically updated when:

- A new category list is obtained from the website
- Stored categories differ from the obtained categories

The file is automatically created if it doesn't exist and is synchronized between source code and compiled version.

## 🐛 Error Handling

The API returns appropriate errors in case of problems:

- **400 Bad Request**: When required parameters are not provided or invalid
- **Custom error**: When a category or book is not found

**Error examples:**
```json
// Category not found
{
  "statusCode": 400,
  "message": "Category not found",
  "error": "Bad Request"
}

// Book not found
{
  "statusCode": 400,
  "message": "Book with id 9999 not found",
  "error": "Bad Request"
}

// Missing required parameter
{
  "statusCode": 400,
  "message": "Name or id is required",
  "error": "Bad Request"
}
```

## 📝 Important Notes

1. The API performs real-time scraping from the Books To Scrape website
2. Categories are cached locally for better performance
3. Pagination is supported for book listings
4. All monetary values are in British pounds (£)
5. Book IDs are extracted from URLs and are displayed in descending order (ID 1000 first, ID 1 last)
6. The book details endpoint uses mathematical optimization to directly calculate which page contains a specific book, requiring only 2 HTTP requests (one for the listing page, one for the detail page)
7. Each book in listings now includes its `id` and `url`, allowing direct access to detailed information

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and has no public license.

## 👨‍💻 Author

Luiz Gustavo Andrade

Developed as a study project with NestJS and TypeScript.

---

**⚠️ Warning:** This project is for educational purposes only. Please respect the Terms of Use of the Books To Scrape website when using this API.

> **Note**: This README.md was enhanced with AI