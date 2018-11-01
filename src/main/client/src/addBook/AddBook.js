import React, { Component } from 'react'
import * as axios from "axios";
import BookForm from "../common/BookForm"

export default class AddBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isbn: "",
            title: "",
            author: "",
            publishDate: "",
            buttonText: "Add book"
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleChange(evt) {
        if (evt.target.id === "publishDate" && evt.target.value.length > 0) { 
            evt.target.value = evt.target.value.slice(0, 4) };
            this.setState({ [evt.target.id]: evt.target.value.trimStart() });
    }

    async submitForm(evt) {
        evt.preventDefault();
        let newBook = {
            "isbn": this.state.isbn.trim(),
            "title": this.state.title.trim(),
            "author": this.state.author.trim(),
            "publishDate": this.state.publishDate.trim()
        }
        await axios.post('/api/books', newBook);
            this.setState({
                isbn: "",
                title: "",
                author: "",
                publishDate: ""
            })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submitForm}>
                    <BookForm state={this.state} handleChange={this.handleChange} />
                </form>
            </div>
        )
    }
}