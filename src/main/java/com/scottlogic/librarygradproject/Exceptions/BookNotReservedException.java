package com.scottlogic.librarygradproject.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookNotReservedException extends RuntimeException{
    public BookNotReservedException(Long bookId) {super("Book with id: " + bookId + " is not reserved"); }
}
