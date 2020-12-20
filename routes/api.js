/*
*
*
*       Complete the API routing below
*       
*       
*/
const {Book} = require('../models/book');
const mongoose = require('mongoose');
'use strict';



//compares all the string elements inside requiredFields to each element in issue object,
//if it finds a match pushes it to the errors array



module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res)=>{
        let books = await Book.find().exec();
        return res.status(200).send(books);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res)=>{
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        return res.send('missing required field title');
      }
      let newBook = await new Book({
        title:title
      })
      await newBook.save(function(err){
        if(err) return console.log(err);
      })
      //we have to convert mongoose object instance to regular javascript object so
      //we can modify its properties
      let tempnewBook = newBook.toObject();
      delete tempnewBook.commentcount;
      delete tempnewBook.comments;
      console.log(tempnewBook)
      res.send(tempnewBook);
    })
    
    .delete(async (req, res)=>{
      await Book.deleteMany({},function(err,res){
          if(err) return console.log(err);
      })

      res.send('complete delete successful')
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res)=>{
      let bookid = req.params.id;
      let specificBook = await Book.findOne({_id:bookid}).exec();
      if(!specificBook){
        return res.send('no book exists');
      }
      return res.status(200).send(specificBook);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res)=>{
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){
        return res.status(200).send('missing required field comment');
      }
      let specificBook = await Book.findOne({_id:bookid}).exec();
      if(!specificBook){
        return res.send('no book exists');
      }

      specificBook.comments.push(comment);
      specificBook.commentcount=specificBook.comments.length;
      console.log(specificBook.comments.length, ' ++++!!!!!')
      await specificBook.save(function(err){
        if(err) return console.log(err);
      })

      return res.status(200).send(specificBook);
      //json res format same as .get
    })
    
    .delete(async (req, res)=>{
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let book = await Book.findOne({_id:bookid}).exec();
      if(!book){
        return res.send('no book exists')
      }else{
         book.deleteOne({_id:bookid});
        return res.status(200).send('delete successful')
      }
    });
  
};
