const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Get the book list available in the shop. DONE
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4))
  });


// Get book details based on ISBN. DONE
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author. DONE
public_users.get('/author/:author',function (req, res) {
    let authors_books = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        authors_books.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({authors_books}, null, 4));
  });
// Get all books based on title DONE
public_users.get('/title/:title',function (req, res) {
    let title_book = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        title_book.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({title_book}, null, 4));
  });

//  Get book review DONE
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
  });
  
  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


  public_users.post("/register", (req, res) => {
    //public_users.post("/login", (req, res) => {    
      //Write your code here
       const username = req.body.username;
      const password = req.body.password;
    
      if (username && password) {
        if (!doesExist(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User " + username+ " successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User " + username+ " already exists!"});    
        }
      } 
      return res.status(404).json({message: "Unable to register user."});
    });

module.exports.general = public_users;
