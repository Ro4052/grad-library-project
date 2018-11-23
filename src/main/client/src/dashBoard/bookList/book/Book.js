import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import EditBook from "./EditBook";
import styles from "./Book.module.css";
import RequestButton from "./requestButton/RequestButton";

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
    this.checkAvailability = this.checkAvailability.bind(this);
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

  checkAvailability(bookId) {
    this.setState({
      availabilityChecked: true
    });
    this.props.checkBook(bookId);
  }

  render() {
    const { book } = this.props;
    let request;
    let colour;
    let buttonText;
    request = book.isAvailable ? this.props.borrowBook : this.props.reserveBook;
    colour = book.isAvailable ? "green" : "blue";
    buttonText = book.isAvailable ? "Borrow" : "Reserve";
    return (
      <li className={styles.book}>
        {this.props.deleteMode ? (
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
        {this.state.availabilityChecked ? (
          <div>
            <RequestButton
              buttonText={buttonText}
              request={request}
              bookId={book.id}
              popupText={this.props.popupText}
              colour={colour}
            />
            {/* <RequestButton
              buttonText="Borrow"
              request={this.props.borrowBook}
              bookId={book.id}
              popupText={this.props.popupText}
              colour={"green"}
            /> */}
          </div>
        ) : (
          <RequestButton
            buttonText="Check Availability"
            request={this.checkAvailability}
            bookId={book.id}
            popupText={this.props.popupText}
          />
        )}

        {book.editState ? (
          <EditBook
            updateBook={this.props.updateBook}
            book={book}
            editStateChange={this.props.editStateChange}
          />
        ) : (
          this.props.loggedIn && (
            <Button onClick={() => this.props.editStateChange(book.id)}>
              Edit
            </Button>
          )
        )}
      </li>
    );
  }
}
