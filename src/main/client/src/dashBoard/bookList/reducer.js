import axios from "axios";

import {
  addBorrow,
  removeBorrow,
  addReservation,
  removeReservation
} from "../../login/reducer";

export const types = {
  GET_BOOKS: "bookList/GET_BOOKS"
};

const INITIAL_STATE = {
  books: []
};

// Actions
const getBooksAction = books => ({
  type: types.GET_BOOKS,
  books
});

// Action Creators
export const getBooks = () => (dispatch, getState) => {
  axios.get("/api/books").then(res => {
    const books = res.data.map(book => {
      return {
        ...book,
        editState: false,
        popupText: "click to check availability",
        collectPopupText: `Collect ${book.title}`,
        availabilityChecked: false,
        isAvailable: undefined
      };
    });
    dispatch(getBooksAction(books));
    dispatch(checkAllBooks(getState().login.user));
  });
};

export const editStateChange = id => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(book => {
    return book.id === id ? { ...book, editState: !book.editState } : book;
  });
  dispatch(getBooksAction(newBooks));
};

export const isBookAvailable = (id, bool) => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(book => {
    return book.id === id
      ? { ...book, isAvailable: bool, availabilityChecked: true }
      : book;
  });
  dispatch(getBooksAction(newBooks));
};

export const popupText = (text, id) => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(book => {
    return book.id === id ? { ...book, popupText: text } : book;
  });
  dispatch(getBooksAction(newBooks));
};

export const updateBook = updatedBook => (dispatch, getState) => {
  axios.put(`/api/books/${updatedBook.id}`, updatedBook);
  const newBooks = getState().bookList.books.map(book => {
    return book.id === updatedBook.id
      ? {
          ...updatedBook,
          popupText: book.popupText,
          availabilityChecked: book.availabilityChecked,
          isAvailable: book.isAvailable,
          editState: false,
          processStarted: false,
          role: book.role
        }
      : book;
  });
  dispatch(getBooksAction(newBooks));
};

export const deleteBook = bookIds => (dispatch, getState) => {
  axios.delete("/api/books", { data: bookIds });
  const newBooks = getState().bookList.books.filter(
    book => !bookIds.includes(book.id)
  );
  dispatch(getBooksAction(newBooks));
};

export const reserveBook = book => (dispatch, getState) => {
  const bookId = book.id;
  // Reset popup text
  dispatch(popupText("Loading...", bookId));
  axios
    .post(`/api/reserve/${bookId}`)
    .then(res => {
      // Success popup text
      dispatch(popupText("Reservation successful!", bookId));
      const newBooks = getState().bookList.books.map(eachBook => {
        if (eachBook.id === book.id) {
          eachBook.borrowId = null;
          eachBook.reservationId = res.data.id;
          eachBook.role = "Reserver";
          eachBook.popupText = "Cancel your Reservation";
          dispatch(addReservation(res.data, book.id));
        }
        return eachBook;
      });
      dispatch(getBooksAction(newBooks));
    })
    .catch(() => {
      // Failure popup text
      dispatch(popupText("Reservation failed", bookId));
    });
};

export const borrowBook = book => (dispatch, getState) => {
  const bookId = book.id;
  dispatch(popupText("Loading...", bookId));
  axios
    .post(`/api/borrow/${bookId}`)
    .then(res => {
      dispatch(popupText("Book successfully borrowed!", bookId));
      const newBooks = getState().bookList.books.map(eachBook => {
        if (eachBook.id === book.id) {
          eachBook.borrowId = res.data.id;
          eachBook.reservationId = null;
          eachBook.role = "Borrower";
          eachBook.popupText = "Return your Book";
          eachBook.processStarted = false;
          dispatch(addBorrow(res.data, book.id));
        }
        return eachBook;
      });
      dispatch(getBooksAction(newBooks));
    })
    .catch(() => {
      dispatch(popupText("Book cannot be borrowed at this time", bookId));
    });
};

export const collectBook = book => (dispatch, getState) => {
  const bookId = book.id;
  dispatch(popupText("Loading...", bookId));
  axios
    .post(`/api/borrow/collect/${bookId}`)
    .then(res => {
      dispatch(popupText("Book collected!", bookId));
      const newBooks = getState().bookList.books.map(eachBook => {
        if (eachBook.id === book.id) {
          dispatch(removeReservation(eachBook.reservationId));
          eachBook.borrowId = res.data.id;
          eachBook.reservationId = null;
          eachBook.role = "Borrower";
          eachBook.popupText = "Return your Book";
          eachBook.processStarted = false;
          dispatch(addBorrow(res.data, book.id));
        }
        return eachBook;
      });
      dispatch(getBooksAction(newBooks));
    })
    .catch(() => {
      dispatch(popupText("Book cannot be collected at this time", bookId));
    });
};

export const checkBook = book => dispatch => {
  const bookId = book.id;
  dispatch(popupText("Loading...", bookId));
  axios
    .get(`/api/borrow/check/${bookId}`)
    .then(res => {
      if (res.data) {
        axios.get(`/api/reserve/check/${bookId}`).then(res => {
          dispatch(
            popupText(`Number of reservations: ${res.data}`, bookId, false)
          );
          dispatch(isBookAvailable(bookId, false));
        });
      } else {
        dispatch(popupText("Available", bookId, true));
        dispatch(isBookAvailable(bookId, true));
      }
    })
    .catch(() => {
      dispatch(popupText("Something went wrong", bookId));
    });
};

export const checkAllBooks = user => (dispatch, getState) => {
  let role, reservationId, borrowId, popupText;
  const newBooks = getState().bookList.books.map(book => {
    borrowId = null;
    reservationId = null;
    role = "Nothing";
    popupText = "Click to check availability";
    user.reservations.forEach(reservation => {
      if (reservation.bookId === book.id) {
        borrowId = null;
        reservationId = reservation.id;
        popupText = "Cancel your reservation";
        role = "Reserver";
      }
    });
    user.borrows.forEach(borrow => {
      if (borrow.bookId === book.id && borrow.active) {
        borrowId = borrow.id;
        reservationId = null;
        role = "Borrower";
        popupText = "Return your Book";
      }
    });
    book.borrowId = borrowId;
    book.reservationId = reservationId;
    book.role = role;
    book.popupText = popupText;
    return book;
  });
  dispatch(getBooksAction(newBooks));
};

const cancelHelper = (book, books) => {
  const newBooks = books.map(eachBook => {
    if (eachBook.id === book.id) {
      eachBook.borrowId = null;
      eachBook.reservationId = null;
      eachBook.role = "Nothing";
      eachBook.popupText = "Click to check availability";
      eachBook.availabilityChecked = false;
      eachBook.processStarted = false;
    }
    return eachBook;
  });
  return newBooks;
};

export const returnBook = book => (dispatch, getState) => {
  axios.put(`/api/borrow/return/${book.borrowId}`);
  const borrowToEnd = book.borrowId;
  const newBooks = cancelHelper(book, getState().bookList.books);
  dispatch(getBooksAction(newBooks));
  dispatch(removeBorrow(borrowToEnd));
};

export const cancelReservation = book => (dispatch, getState) => {
  axios.delete(`/api/reserve/${book.reservationId}`);
  const resToCancel = book.reservationId;
  const newBooks = cancelHelper(book, getState().bookList.books);
  dispatch(getBooksAction(newBooks));
  dispatch(removeReservation(resToCancel));
};

export const startProcess = book => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(eachBook => {
    if (eachBook.id === book.id) {
      eachBook.processStarted = true;
      eachBook.popupText = "Are you sure?";
    }
    return eachBook;
  });
  dispatch(getBooksAction(newBooks));
};

export const cancelProcess = book => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(eachBook => {
    if (eachBook.id === book.id) {
      eachBook.processStarted = false;
      eachBook.popupText =
        book.role === "Borrower"
          ? "Return your Book"
          : "Cancel your reservation";
    }
    return eachBook;
  });
  dispatch(getBooksAction(newBooks));
};

export const startCollection = book => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(eachBook => {
    if (eachBook.id === book.id) {
      eachBook.collectionStarted = true;
      eachBook.collectPopupText = "Are you sure?";
    }
    return eachBook;
  });
  dispatch(getBooksAction(newBooks));
};

export const cancelCollection = book => (dispatch, getState) => {
  const newBooks = getState().bookList.books.map(eachBook => {
    if (eachBook.id === book.id) {
      eachBook.collectionStarted = false;
      eachBook.collectPopupText = `Collect ${book.title}`;
    }
    return eachBook;
  });
  dispatch(getBooksAction(newBooks));
};

// Reducers
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_BOOKS:
      return { ...state, books: action.books };
    default:
      return state;
  }
};
