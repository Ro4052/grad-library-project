package com.scottlogic.librarygradproject.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookNotFoundException extends RuntimeException {


    private List<Long> bookIDs = new ArrayList<>();

    public BookNotFoundException(long id) {
        this.bookIDs.add(id);
    }
    public BookNotFoundException(List<Long> listOfIds) {
        this.bookIDs = listOfIds;
    }

    public String getMessage() {
        final StringBuilder returnMessage = new StringBuilder("Could not find book ids:");
        bookIDs.forEach(id -> returnMessage.append(" " + id));
        return returnMessage.toString();
    }
}
