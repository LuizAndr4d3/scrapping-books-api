import { Module } from '@nestjs/common';
import { BooksController } from './core/books/books.controller';
import { BooksService } from './core/books/books.service';


@Module({
  imports: [],
  controllers: [BooksController],
  providers: [BooksService],
})
export class AppModule {}
