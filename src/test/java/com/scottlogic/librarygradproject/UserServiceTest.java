package com.scottlogic.librarygradproject;

import com.scottlogic.librarygradproject.Entities.Book;
import com.scottlogic.librarygradproject.Entities.Borrow;
import com.scottlogic.librarygradproject.Entities.LibraryUser;
import com.scottlogic.librarygradproject.Entities.Reservation;
import com.scottlogic.librarygradproject.Exceptions.UserNotFoundException;
import com.scottlogic.librarygradproject.Services.BookService;
import com.scottlogic.librarygradproject.Services.BorrowService;
import com.scottlogic.librarygradproject.Services.ReservationService;
import com.scottlogic.librarygradproject.Services.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDate;
import java.util.*;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@DataJpaTest
public class UserServiceTest {

    @Autowired
    UserService service;

    @Autowired
    ReservationService reservationService;

    @Autowired
    BorrowService borrowService;

    @Autowired
    BookService bookService;

    LibraryUser user1 = LibraryUser.builder()
            .userId("TestUser 1")
            .name("testuser 1")
            .avatarUrl("avatar_url")
            .build();
    LibraryUser user2 = LibraryUser.builder()
            .userId("TestUser 2")
            .name("testuser 2")
            .avatarUrl("")
            .build();
    LibraryUser user3 = LibraryUser.builder()
            .userId("TestUser 3")
            .name("testuser 3")
            .avatarUrl("")
            .build();

    OAuthClientTestHelper helper = new OAuthClientTestHelper("TestUser 1", "testuser 1", "avatar_url");
    OAuth2Authentication authentication;
    OAuthClientTestHelper helper2 = new OAuthClientTestHelper("TestUser 2", "testuser 2", "");
    OAuth2Authentication authentication2 = helper2.getOauthTestAuthentication();
    OAuthClientTestHelper helper3 = new OAuthClientTestHelper("TestUser 3", "testuser 3", "");
    OAuth2Authentication authentication3 = helper3.getOauthTestAuthentication();
    Book book1, book2, book3;

    @Before
    public void before_Each_Test() {
        authentication = helper.getOauthTestAuthentication();
        authentication2 = helper2.getOauthTestAuthentication();
        authentication3 = helper3.getOauthTestAuthentication();
        book1 = new Book("0123456789111", "Correct Book1", "Correct Author1", "2001");
        bookService.add(book1);
        book2 = new Book("0123456789", "Correct Book2", "Correct Author2", "2018");
        bookService.add(book2);
        book3 = new Book("0123456789", "Correct Book3", "Correct Author3", "2016");
    }

    @Test
    public void add_user() {
        service.add(user1);
        List<LibraryUser> users = service.findAll();
        assertArrayEquals(new LibraryUser[]{user1}, users.toArray());
    }

    @Test
    public void find_One_User() {
        service.add(user1);
        service.add(user2);
        LibraryUser user = service.findOne("TestUser 1");
        assertEquals(user1, user);
    }

    @Test
    public void userInfo_Saves_User() {
        service.userInfo(authentication);
        assertArrayEquals(new LibraryUser[] {user1}, service.findAll().toArray());

    }

    @Test (expected = UserNotFoundException.class)
    public void user_Not_Found_Correct_Exception() {
        service.findOne("NoUser");
    }

    @Test
    public void userInfo_Finds_Reservation() {
        service.add(user1);
        service.add(user2);
        borrowService.borrow(1, authentication);
        borrowService.borrow(2, authentication2);
        reservationService.reserve(1, authentication2);
        reservationService.reserve(2, authentication);
        Reservation userReservation = Reservation.builder().userId("TestUser 1")
                .bookId(2)
                .queuePosition(1)
                .build();
        userReservation.setId(2);
        List<Reservation> userReservations = ((List<Reservation>) service.userInfo(authentication).get("reservations"));
        assertArrayEquals(new Reservation[]{userReservation}, userReservations.toArray());
    }

    @Test
    public void userInfo_Finds_No_Reservation() {
        service.add(user2);
        service.add(user3);
        borrowService.borrow(1, authentication2);
        borrowService.borrow(2, authentication3);
        reservationService.reserve(1, authentication3);
        reservationService.reserve(2, authentication2);
        List<Reservation> userReservations = ((List<Reservation>) service.userInfo(authentication).get("reservations"));
        assertArrayEquals(new Reservation[]{}, userReservations.toArray());
    }

    @Test
    public void userInfo_Finds_Borrow() {
        borrowService.borrow(1, authentication);
        borrowService.borrow(2, authentication2);
        Borrow userBorrow = Borrow.builder().userId("TestUser 1")
                .borrowDate(LocalDate.now())
                .returnDate(LocalDate.now().plusDays(7))
                .bookId(1)
                .isActive(true)
                .build();
        userBorrow.setId(1);
        List<Borrow> userBorrows = ((List<Borrow>) service.userInfo(authentication).get("borrows"));
        assertArrayEquals(new Borrow[]{userBorrow}, userBorrows.toArray());
    }

    @Test
    public void userInfo_Finds_No_Borrow() {
        borrowService.borrow(1, authentication2);
        borrowService.borrow(2, authentication2);
        List<Borrow> userBorrows = ((List<Borrow>) service.userInfo(authentication).get("borrows"));
        assertArrayEquals(new Reservation[]{}, userBorrows.toArray());
    }
}
