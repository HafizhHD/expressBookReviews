const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  console.log(username, password)
  if (!(username && password)) {
    return res.status(400).json({ message: "Username and password are required." })
  }
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists." })
  }
  users.push({ username, password })
  return res.status(200).json({ message: "Registration is successful." })
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let bookResult = null
  for (var i = 0; i < books.length && !bookResult; i++) {
    if (books[i].isbn === req.params.isbn) bookResult = books[i]
  }
  if (bookResult) return res.status(200).json(bookResult)
  else return res.status(400).json({ message: "Book doesn't exist." })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksResult = books.filter(book => book.author.toLowerCase() === req.params.author.toLowerCase())
  if (booksResult.length > 0) return res.status(200).json(booksResult)
  else return res.status(400).json({ message: "Books from this author doesn't exist." })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksResult = books.filter(book => book.title.toLowerCase() === req.params.title.toLowerCase())
  if (booksResult.length > 0) return res.status(200).json(booksResult)
  else return res.status(404).json({ message: "Books with this title doesn't exist." })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let bookResult = null
  for (var i = 0; i < books.length && !bookResult; i++) {
    if (books[i].isbn === req.params.isbn) bookResult = books[i]
  }
  if (bookResult) return res.status(200).json(bookResult.reviews)
  else return res.status(400).json({ message: "Book doesn't exist." })
});

function getBookList() {
  return new Promise((resolve, reject) => {
    if(books) resolve(books)
    else reject("Books not found.")
  });
}
public_users.get("/", function (req, res) {
  getBookList().then(
    books => res.send(JSON.stringify(books)),
    error => res.send(error)
  )
})

function getBookFromISBN(isbn) {
  let bookResult = null
  for (var i = 0; i < books.length && !bookResult; i++) {
    if (books[i].isbn === isbn) bookResult = books[i]
  }
  return new Promise((resolve, reject) => {
    if (bookResult) resolve(bookResult)
    else reject("Book doesn't exist.")
  })
}
public_users.get("/isbn/:isbn", function (req, res) {
  getBookFromISBN(req.params.isbn).then(
    result => res.send(JSON.stringify(result)),
    error => res.send(error)
  )
})

function getBookFromAuthor(author) {
  return new Promise((resolve, reject) => {
    const booksResult = books.filter(book => book.author.toLowerCase() === author.toLowerCase())
    if(booksResult.length > 0) resolve(booksResult)
    else reject("Books from this author doesn't exist.")
  })
}
public_users.get("/author/:author", function (req, res) {
  getBookFromAuthor(req.params.author).then(
    result => res.send(JSON.stringify(result)),
    error => res.send(error)
  )
})

function getBookFromTitle(title) {
  return new Promise((resolve, reject) => {
    const booksResult = books.filter(book => book.title.toLowerCase() === title.toLowerCase())
    if (booksResult.length > 0) resolve(booksResult)
    else reject("Books with this title doesn't exist.")
  });
}
public_users.get("/title/:title", function (req, res) {
  getBookFromTitle(req.params.title).then(
    result => res.send(JSON.stringify(result)),
    error => res.send(error)
  )
})

module.exports.general = public_users;
