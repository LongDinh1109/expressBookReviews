const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password){
    if(users.find(user => user.username === username)){
      return res.status(404).json({message: "User already exists!"})
    } else{
      users.push({
        "username": username,
        "password": password
      })
      return res.status(200).json({message: "Customer successfully registered. Now you can login!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

let getAllBooks = new Promise((resolve)=>{
  setTimeout(() => {
    resolve(books)
  },6000)
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getAllBooks.then((data)=>{
    return res.send(JSON.stringify(data,null,4))
  })
});

async function getDetailsByIsbn(isbn){
  try {
    return new Promise((resolve)=>{
      setTimeout(() => {
        resolve(books[isbn])
      },6000)
    })
  } catch (error) {
    console.error('Error posting data:', error); 
  }
} ;

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookDetailsByIsbn = await getDetailsByIsbn(isbn);
  return res.send(bookDetailsByIsbn);
 });

 async function getBookDetailsByAuthor(author,isbnList) {
  let booksFilteredByAuthor = {
    "booksbyauthor": []
  };
  try {
    return new Promise((resolve)=>{
      setTimeout(() => {        
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
        resolve(booksFilteredByAuthor)
      }, 6000);
    })
  }catch(err){
    console.error('Error posting data:', err); 
  }
 }
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const isbnList = Object.keys(books);
  const bookDetailsByAuthor = await getBookDetailsByAuthor(author,isbnList);
  return res.send(bookDetailsByAuthor);
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
  const isbn = req.params.isbn;
  const reviewByIsbn = books[isbn].reviews;
  return res.send(reviewByIsbn);
});

module.exports.general = public_users;
