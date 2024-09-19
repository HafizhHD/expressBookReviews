const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "accessKey", { expiresIn: "1h" })
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).send("Login successful.")
  }
  else return res.status(400).json({message: "Invalid username or password."})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const review = req.body.review
  const username = req.session.authorization.username

  let book = books.filter(book => book.isbn === isbn)

  if (book.length > 0) {
    book[0].reviews.push({ username, review })
    return res.status(200).send("Review added.")
  }
  else {
    return res.status(400).json({message: "ISBN not found."})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
