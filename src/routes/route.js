const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');

const commonMw=require("../middleware/commonmiddleware")



// router.post('/RegisterUser',userController.RegisterUser)
// router.post('/login',userController.Login)
router.post('/Book',bookController.CreateBook)
// router.get('/getBooks',bookController.getBooks)
// router.get('/getBooks/:bookId',bookController.getBookById)
router.put('/books/:bookId',bookController.updateBook)
router.delete('/books/:bookId',bookController.deleteBookById)
// router.post('/books/:bookId/review',reviewController.addNewReview)
// router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
// router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)










// router.post('/authors',AuthorController.authorsCollection);
// router.post('/blogs',commonMw.validator, BlogController.createBlog);
// router.get("/blogs",commonMw.validator,BlogController.getThisBlog) 
// router.put('/blogs/:blogId',commonMw.validator,BlogController.updateDetails)
// router.delete("/blog/:blogId",commonMw.validator,BlogController.deleteBlog)
// router.delete("/blog",commonMw.validator,BlogController.specificDelete)

////////////////
  











module.exports = router;