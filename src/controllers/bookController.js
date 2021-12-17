const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


//value checking
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
 }
  //ObjectId checking
 const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}
 //ObjectId checking
 const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



//  book creation -------created for my use
const CreateBook = async function (req, res) {
    try {
        var data = req.body
       
        if (data) {
            let savedData = await bookModel.create(data)
            res.status(200).send({ status: true, msg: savedData })
        } else {
            res.status(400).send({ status: false, msg: "Mandatory body missing" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.CreateBook = CreateBook;


//updateBookById    put/books/:bookId
const updateBook = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const bookId = params.bookId.trim()
         //------------------for token ------------------------
       // const userIdFromToken = req.userId or let id=req.validToken._id
        
        // Validation stats
        if(!isValidObjectId(bookId)) {
            return  res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
          
        }
         //------------------for token ------------------------
        // if(!isValidObjectId(userIdFromToken)) {
        //     res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
        //     return
        // }

        const book = await bookModel.findOne({_id: bookId, isDeleted: false})//, deletedAt: null 

        if(!book) {
            return   res.status(404).send({status: false, message: `book not found`})
           
        }

        //------------------for token ------------------------
        // if(book.userId.toString() !== userIdFromToken) {
        //     res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
        //     return
        // }

        if(!isValidRequestBody(requestBody)) {
            return res.status(200).send({status: true, message: 'No paramateres passed. Book unmodified', data: book})
           
        }

        // Extract params
        let {title, excerpt, releasedAt, isbn} = requestBody;

        const updatedBookData = {}

       //Make sure the unique constraints are not violated when making the update

       let checktitle = await bookModel.findOne({ title : title })
         if (checktitle) {
            return  res.send({ message: "same title is already exist", data: checktitle })
         }
        if(isValid(title)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBookData, '$set')) updatedBookData['$set'] = {}

            updatedBookData['$set']['title'] = title
        }
        let checkexcerpt = await bookModel.findOne({ excerpt : excerpt })
        if (checkexcerpt) {
            return  res.send({ message: "same excerpt is already exist", data: checkexcerpt })
        }
        if(isValid(excerpt)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBookData, '$set')) updatedBookData['$set'] = {}

            updatedBookData['$set']['excerpt'] = excerpt
        }
      
        //  releasedAt = new Date(releasedAt).toISOString().split('T')[0]
       // releasedAt =  Date(releasedAt).toDateString()
       //releasedAt =  Date(releasedAt).split(' ')[0];
        if(isValid(releasedAt)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBookData, '$set')) updatedBookData['$set'] = {}

            updatedBookData['$set']['releasedAt'] = releasedAt
        }
        let checkisbn = await bookModel.findOne({ isbn : isbn })
        if (checkisbn) {
            return  res.send({ message: "same isbn is already exist", data: checkisbn })
        }

        if(isValid(isbn)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBookData, '$set')) updatedBookData['$set'] = {}

            updatedBookData['$set']['isbn'] = isbn
        }

        //----------------- updatedAt date changing------------------------
        // if(updatedAt !== undefined) {
        //     if(!Object.prototype.hasOwnProperty.call(updatedBookData, '$set')) updatedBookData['$set'] = {}

        //     updatedBookData['$set']['updatedAt'] = new Date() ;
        // }
          
        const updatedBook = await bookModel.findOneAndUpdate({_id: bookId}, updatedBookData, {new: true})

        res.status(200).send({status: true, message: 'Succeess, Book updated successfully', data: updatedBook});
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
    
    }
    
module.exports.updateBook=updateBook;

  












//deleteBookById    delete/books/:bookId
let deleteBookById = async function (req, res) {
    try {
        const bookId=req.params.bookId.trim()
        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: 'Enter a bookId'})
         }
         if(!isValidObjectId(bookId)) {
            res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
            return
        }

        let filter={isDeleted:false}  
        // filter["userId"]=req.validToken._id
        filter["_id"]=bookId
        console.log(filter)
        let deletedTime = new Date();
       
        let DeletedBook=await bookModel.findOneAndUpdate(filter,{isDeleted: true, deletedAt: deletedTime })
        if(DeletedBook){
            res.status(200).send( {status: true, msg: "Book has been deleted" })
        }else{
            res.status(404).send({status: false, msg: "either the blog is already deleted or you are not valid user to access this book" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports.deleteBookById=deleteBookById;


















































// try {
        //     if (!isValid(req.params.bookId)) {
        //         return res.status(400).send({ status: false, msg: 'Enter a bookId'})
        //     }

        //     const title = req.body.title;
        //     const excerpt = req.body.excerpt;
        //     const releasedAt = req.body.releasedAt;
        //     const isbn = req.body.isbn;
        //    // let id=req.validToken._id
        //     let updateBook = {}
        //     await bookModel.findOneAndUpdate(
        //         { _id: req.params.bookId, isDeleted:false }, //, userId:id
               
        //         { title: title }, 
        //         { excerpt: excerpt },
        //         { releasedAt: releasedAt },
        //         { isbn: isbn },
                
        //         {updatedAt:new Date()},
        //         { new: true })
    
        //    //Make sure the unique constraints are not violated when making the update
           
        //   console.log(updateBook)
        //    let updatedBlog = await blogModel.find({ _id: req.params.blogId, isDeleted:false })//, authorId:id
    
        //     res.status(200).send({ status: true, msg:"Success", data: updatedBlog  })
    
        // } catch (err) {
        //     res.status(500).send({ msg: err });
        // }






// //Q2
// const createBlog = async function (req, res) {
//     try {
//         if(req.body.authorId==req.validToken._id){
//             let savedData=await blogModel.create(req.body)
//             res.status(200).send({status:true,data:savedData})
//         }else(
//             res.status(404).send({status:false,msg:"provide your authorId"})
//         )
//     } catch (error) {
//         console.log(error)
//         res.status(400).send({ status: false, msg: "server error" })
//     }
// };




// //Q3
// const getThisBlog = async function (req, res) {

//     try {
        
//        if(Object.values(req.query).length===0){//returns array of i.e.[isDeleted:false,isPublished:true, ]
//             let filter={isDeleted:false,isPublished:true,authorId:req.validToken._id}
//             let data=await blogModel.find(filter)
//             if(data){
//                 res.status(200).send({status:true,data:data})
//             }else{
//                 res.status(404).send({status:false,msg:"no such blog found"})
//             }
           
//        }else{
//            req.query["authorId"]=req.validToken._id
//            data=await blogModel.find(req.query)
//            if(data){
//                res.status(200).send({status:true,data:data})
//            }else{
//                res.status(404).send({status:false,msg:"no such blog found"})
//            }
//            }
//         }
//     catch (err) {
//         console.log(err)
//         res.send(err)
//     }
// }

// //Q4-
// const updateDetails = async function (req, res) {
//     try {
//         const title = req.body.title;
//         const body = req.body.body;
//         const tags = req.body.tags;
//         const subcategory = req.body.subcategory;
//         let id=req.validToken._id
//         let Update = {}
//         Update.title = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id }, { title: title }, { new: true })

//         Update.body = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { body: body }, { new: true })

//         Update.tags = await blogModel.findOneAndUpdate({ _id: req.params.blogId , isDeleted:false, authorId:id}, { $push: { tags: tags } }, { new: true })

//         Update.subcategory = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { $push: { subcategory: subcategory } }, { new: true })

//         Update.isPublished = await blogModel.findOneAndUpdate({ _id: req.params.blogId , isDeleted:false, authorId:id }, { isPublished: true }, { new: true })

//         Update.publishedAt = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { publishedAt: String(new Date()) }, { new: true })
        
//         let updatedBlog = await blogModel.find({ _id: req.params.blogId, isDeleted:false, authorId:id })

//         res.send({ data: updatedBlog })

//     } catch (err) {
//         res.status(500).send({ msg: err });
//     }

// }





//Q5-
// let deleteBlog = async function (req, res) {
//     try {
       
//         let filter={isDeleted:false}  
//         filter["authorId"]=req.validToken._id
//         filter["_id"]=req.params.blogId
//         console.log(filter)
//         let deletedTime = String(new Date());
       
//         let DeletedBlog=await blogModel.findOneAndUpdate(filter,{isDeleted: true, deletedAt: deletedTime })
//         if(DeletedBlog){
//             res.status(200).send( {status: true, msg: "Blog has been deleted" })
//         }else{
//             res.status(404).send({status: false, msg: "either the blog is already deleted or you are not valid author to access this blog" })
//         }
//     }
//     catch (err) {
//         // console.log(err)
//         res.send(err)
//     }
// }

// //Q6-

// const specificDelete = async function (req, res) {
//     try {
//         const filter = {
//             isDeleted: false,
//             isPublished:false,
            
//         };
//         filter["authorId"]=req.validToken._id
        
        
//         if (req.query.category) {
//             filter["category"] = req.query.category;
//         }
//         if (req.query.AuthorId) {
//         filter["authorId"] = req.query.AuthorId;
//         }
//         if (req.query.tags) {
//             filter["tags"] = req.query.tags;
//         }
//         if (req.query.subcategory) {
//             filter["subcategory"] = req.query.subcategory;
//         }
       
//         let deletedTime = String(new Date());
//         let deleteData = await blogModel.findOneAndUpdate(filter, {
//             isDeleted: true,
//             deletedAt: deletedTime
//         });
      
//         if (deleteData) {
//             res.status(200).send({ status: true, msg: "Blog has been deleted" });
//         } else {
//             res.status(404).send({ status: false, msg: "no such blog exist" });
//         }
//     } catch {
//         res.status(500).send({ status: false, msg: "Something went wrong" });
//     }
// }



// module.exports.createBlog = createBlog;
// module.exports.getThisBlog = getThisBlog;
// module.exports.updateDetails = updateDetails
// module.exports.deleteBlog = deleteBlog
// module.exports.specificDelete = specificDelete




