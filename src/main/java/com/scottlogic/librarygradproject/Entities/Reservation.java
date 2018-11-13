package com.scottlogic.librarygradproject.Entities;

import lombok.Builder;
import lombok.Data;

import javax.persistence.*;

@Data
@Builder
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long bookId;
    private String username;
    private long queuePosition;

    public Reservation() { }

    public Reservation(long bookId, String username, long queuePosition) {
        this.bookId = bookId;
        this.username = username;
        this.queuePosition = queuePosition;
    }

    public static class ReservationBuilder {
        public Reservation build() {
            return new Reservation(this.bookId, this.username, this.queuePosition);
        }
    }
}