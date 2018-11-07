package com.scottlogic.librarygradproject;

import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import static org.mockito.Mockito.*;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@DataJpaTest
public class BookServiceTest {

    @Autowired
    BookService service;

    Book correctBook1 = new Book("0123456789", "Correct Book", "Correct Author", "1999");
    Book correctBook2 = new Book("0123456789", "Correct Book", "Correct Author", "1999");
    Book correctBook3 = new Book("0123456789", "Correct Book", "Correct Author", "1999");

    @Test
    public void new_BookRepository_Is_Empty() {
        List<Book> books = service.findAll();
        assertTrue(books.isEmpty());
    }

    @Test
    public void add_Inserts_New_Book() {
        service.save(correctBook1);
        List<Book> books = service.findAll();
        assertArrayEquals(new Book[]{correctBook1}, books.toArray());
    }

    @Test
    public void add_With_Whitespaces_Trims_And_Inserts() {
        Book newBook = new Book("  1231231231231 ", "    Correct Book ", "  Correct Author  ", " 1999 ");
        service.save(newBook);
        Book trimmedBook = new Book("1231231231231", "Correct Book", "Correct Author", "1999");
        assertArrayEquals(new Book[]{trimmedBook}, service.findAll().toArray());
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_Incorrect_BookISBN_Throws() {
        Book newBook = new Book("012345678", "Correct Book", "Correct Author", "1999");
        service.save(newBook);
    }

    @Test
    public void add_With_Null_BookISBN_Works() {
        Book newBook = new Book(null, "Correct Book", "Correct Author", "1999");
        service.save(newBook);
        assertArrayEquals(new Book[]{newBook}, service.findAll().toArray());
    }

    @Test
    public void add_With_Empty_BookISBN_Works() {
        Book newBook = new Book("", "Correct Book", "Correct Author", "1999");
        service.save(newBook);
        assertArrayEquals(new Book[]{newBook}, service.findAll().toArray());
    }

    @Test
    public void add_With_10Digits_BookISBN_Works() {
        Book newBook = new Book("1231231231", "Correct Book", "Correct Author", "1999");
        service.save(newBook);
        assertArrayEquals(new Book[]{newBook}, service.findAll().toArray());
    }

    @Test
    public void add_With_13Digits_BookISBN_Works() {
        Book newBook = new Book("1231231231231", "Correct Book", "Correct Author", "1999");
        service.save(newBook);
        assertArrayEquals(new Book[]{newBook}, service.findAll().toArray());
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_9Digits_1Letter_BookISBN_Throws() {
        Book newBook = new Book("123123123A", "Correct Book", "Correct Author", "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_12Digits_1Letter_BookISBN_Throws() {
        Book newBook = new Book("123123123123A", "Correct Book", "Correct Author", "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_Empty_BookTitle_Throws() {
        Book newBook = new Book("012345678", "", "Correct Author", "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_Null_BookTitle_Throws() {
        Book newBook = new Book("012345678", null, "Correct Author", "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_TooLong_BookTitle_Throws() {
        String longTitle = StringUtils.repeat("A", 201);
        Book newBook = new Book("012345678", longTitle, "Correct Author", "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_Empty_BookAuthor_Throws() {
        Book newBook = new Book("012345678", "1", "", "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_Null_BookAuthor_Throws() {
        Book newBook = new Book("012345678", "1", null, "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_TooLong_BookAuthor_Throws() {
        String longAuthor = StringUtils.repeat("A", 201);
        Book newBook = new Book("012345678", "1", longAuthor, "1999");
        service.save(newBook);
    }

    @Test(expected = IncorrectBookFormatException.class)
    public void add_With_Incorrect_BookPublishDate_Throws() {
        Book newBook = new Book("012345678", "Correct Book", "Correct Author", "19991");
        service.save(newBook);
    }

    @Test
    public void get_Returns_Specific_Books() {
        service.save(correctBook1);
        service.save(correctBook2);

        List<Book> allBooks = service.findAll();
        allBooks.forEach(book -> System.out.println(book.getId()));
        Book book = service.findOne((long) 2);
        assertEquals(correctBook2, book);
    }

    @Test
    public void getAll_Returns_All_Books() {
        service.save(correctBook1);
        service.save(correctBook2);
        List<Book> books = service.findAll();
        assertArrayEquals(new Book[]{correctBook1, correctBook2}, books.toArray());
    }

    @Test
    public void delete_Removes_Correct_Book() {
        service.save(correctBook1);
        service.save(correctBook2);
        service.save(correctBook3);
        service.delete((long) 2);
        List<Book> books = service.findAll();
        assertArrayEquals(new Book[]{correctBook1, correctBook3}, books.toArray());
    }

    @Test
    public void put_Updates_Correct_Book() {
        service.save(correctBook1);
        service.save(correctBook2);
        service.save(correctBook3);
        Book editedBook = Book.builder().isbn("1010101010").title("new Title").publishDate("1027").author("New Author").build();
        service.put(editedBook, 1);
        assertThat(service.findOne(1).getTitle(), is(editedBook.getTitle()));
        assertThat(service.findOne(1).getAuthor(), is(editedBook.getAuthor()));
        assertThat(service.findOne(1).getPublishDate(), is(editedBook.getPublishDate()));
        assertThat(service.findOne(1).getIsbn(), is(editedBook.getIsbn()));
    }
}