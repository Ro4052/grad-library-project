import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import EditBook from "./EditBook";
import styles from "./Book.module.css";
import RequestButton from "../../../common/requestButton/RequestButton";

export default class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullTitle: false,
      fullAuthor: false,
      availabilityChecked: false
    };
    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleAuthor = this.toggleAuthor.bind(this);
  }

  toggleTitle() {
    this.setState({
      fullTitle: !this.state.fullTitle
    });
  }

  toggleAuthor() {
    this.setState({
      fullAuthor: !this.state.fullAuthor
    });
  }

  render() {
    const { book } = this.props;
    let request, colour, buttonText;
    switch (book.role) {
      case "Borrower":
        if (!book.processStarted) {
          request = this.props.startProcess;
          colour = "red";
          buttonText = "Return";
        } else {
          request = this.props.returnBook;
          colour = "red";
          buttonText = "Confirm";
        }
        break;
      case "Reserver":
        if (!book.processStarted) {
          request = this.props.startProcess;
          colour = "red";
          buttonText = "Cancel";
        } else {
          request = this.props.cancelReservation;
          colour = "red";
          buttonText = "Confirm";
        }
        break;
      default:
        if (book.availabilityChecked) {
          request = book.isAvailable
            ? this.props.borrowBook
            : this.props.reserveBook;
          colour = book.isAvailable ? "green" : "blue";
          buttonText = book.isAvailable ? "Borrow" : "Reserve";
        } else {
          request = this.props.checkBook;
          colour = null;
          buttonText = "Check Availability";
        }
        break;
    }
    return (
      <li className={styles.book}>
        {this.props.deleteMode && this.props.loggedIn ? (
          <h3 id={`bookTitle${book.id}`}>
            <input
              id={book.id}
              className={styles.checkBox}
              type="checkbox"
              value={book.id}
              onClick={this.props.handleCheck}
            />
            <label htmlFor={book.id} className={styles.bookFieldBreak}>
              {book.title}
            </label>
          </h3>
        ) : (
          <h3
            id={`bookTitle${book.id}`}
            className={
              this.state.fullTitle
                ? styles.bookFieldBreak
                : styles.bookFieldEllipsis
            }
            onClick={this.toggleTitle}
          >
            {book.title}
          </h3>
        )}
        <div className={styles.bookDetails}>
          <div id={`isbn${book.id}`}>ISBN: {book.isbn}</div>
          <div
            id={`author${book.id}`}
            className={
              this.state.fullAuthor
                ? styles.bookFieldBreak
                : styles.bookFieldEllipsis
            }
            onClick={this.toggleAuthor}
          >
            Author: {book.author}
          </div>
          <div id={`publishDate${book.id}`}>
            Publish Date: {book.publishDate}
          </div>
        </div>
        {this.props.loggedIn && (
          <div className={styles.bookBtnsContainer}>
            <RequestButton
              request={request}
              colour={colour}
              buttonText={buttonText}
              book={book}
              cancelProcess={this.props.cancelProcess}
            />
            {book.editState ? (
              <EditBook
                updateBook={this.props.updateBook}
                book={book}
                editStateChange={this.props.editStateChange}
              />
            ) : (
              <Button
                id="editButton"
                onClick={() => this.props.editStateChange(book.id)}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </li>
    );
  }
}
