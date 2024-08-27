const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const isbnList = Object.keys(books);
  let booksFilteredByAuthor = {
    "booksbyauthor": []
  };

  
  for (let i = 0; i < isbnList.length; i++){
    const isnb = isbnList[i];
    const book = books[isnb];
    if(book.author === author){
      const newBook = {
        "isbn" : isnb,
        "title" : book.title,
        "review" : book.reviews
      }
      booksFilteredByAuthor["booksbyauthor"].push(newBook);
    }
  }

  return res.send(booksFilteredByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const isbnList = Object.keys(books);
  let booksFilteredByTitle = {
    "booksbytitle": []
  };

  
  for (let i = 0; i < isbnList.length; i++){
    const isnb = isbnList[i];
    const book = books[isnb];
    if(book.title === title){
      const newBook = {
        "isbn" : isnb,
        "author" : book.author,
        "review" : book.reviews
      }
      booksFilteredByTitle["booksbytitle"].push(newBook);
    }
  }

  return res.send(booksFilteredByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
