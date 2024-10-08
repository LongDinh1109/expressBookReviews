const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  
  if(user){
    return true;
  } else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({data: password},'access',{expiresIn: 60 * 60});

      req.session.authorization = {
        accessToken,username
      }

      return res.status(200).send("User successfully logged in");
    } else return res.status(208).send("Invalid login. Check username and password!");
  }
  
  return res.status(404).json({message: "Please input username and password!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  const user = req.session.authorization['username'];
  const newReview = req.query.review;

  if(newReview){
    reviews[user] = newReview;
    return res.status(200).json({message: "Your review has been added/edited!"})
  } 

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  const user = req.session.authorization['username'];
  if(reviews[user]){
    delete reviews[user];
  }
  
  res.send(`Review for ISBN ${isbn} posted by ${user} deleted`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
