const uuid = require('uuid').v4
const multer = require('multer');
const path = require('path');
const Product = require('../../models/Product')
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../middleware/auth')

let filepath;

var methodOverride = require("method-override");
      

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id = uuid();
        const imageLocation = `images/${id}${ext}`;
        filepath = imageLocation
        cb(null, filepath)
    }
})

const upload = multer({storage})

module.exports = function(app){
    // Get product data


    app.use(methodOverride("_method"))

    app.get('/',checkAuthenticated, (req, res) => {
        Product.find()
        .then(product => {
            console.log(product)
            res.render('index', {product:product})
        })
        .catch(err => {
            console.log(err)
        })
    });

    app.post('/search', (req,res) => {
        const search = req.body.search


        // For multiple search of the same type
        // Product.find({
        //     $or:[
        //         {
        //             productName:{$regex:search, $option:'i'}, price:{$regex:search}
        //         }
        //     ]
        // }) 

        //For single search
        Product.find({
            productName:{
                $regex:search,
                $options:'i'
            }
        }) 
        .then( data => {
            if(!data){
                console.log(data, 'its data')
                res.render('index', {product:data})
            }else{
                console.log(data, 'other data')
                res.render('index', {product:data})
            }
        })
    })

    // Post product data
    app.post('/upload', checkAuthenticated, upload.single('uploaded_file'), (req, res) => {
        const Item = new Product({
            name:req.user,
            productName:req.body.name,
            price:req.body.price,
            filePath:filepath,
            description:req.body.description
        })

        console.log(Item)


        Item
        .save(Item)
        .then(data => {
            res.redirect('/dashboard')
        })
        .catch(err => {
            console.log(err)

        })
    });


    app.get('/form/:id', function(req,res){
        const id = req.params.id;
        
        Product.findById(id)
        .then(data => {
            if(!data){
                res.render('form', {product:data})
            }else{
                console.log(data)
                res.render('form', {product:[data]})
            }
        })
    })

    app.put('/form_update', upload.single('image'), function(req, res){

        if(!req.body){
            console.log("Data to update can not be empty")
        }

        const productName = req.body.productName;
        const price = req.body.price;
        const description = req.body.description;
          
        const updates = {
            productName,
            price,
            description,
            
        }
        const id = req.body.id

        if(req.file){
            const image = req.file.image
            updates.filePath = image
        }

        console.log(id, '[id]', req.body)

        Product.findByIdAndUpdate(id, {
            $set: {
              updates
            }
          },{
            useFindAndModify:false
        })
        .then(data => {
            if(!data){
                res.render('myItem', {product:data})
            }else{
                res.render('myItem', {product:[data]})
            }
        })

    })

       
    app.get('/item/:id', function(req,res){
        const id = req.params.id;
        
        Product.findById(id)
        .then(data => {
            if(!data){
                res.render('item', {product:data})
            }else{
                console.log(data)
                res.render('item', {product:data})
            }
        })
    })
    
    app.get('/myItem',checkAuthenticated, function(req,res){
        console.log(req.user.id, 'user id')
        if(req.user.id){
            const id = req.user.id

            Product.find({name:id})
            .then(data => {
                if(!data){
                    console.log(data, 'not data')
                    res.render('myItem', {product:data})
                }else{
                    console.log(data, 'found data')
                    if(!data.length){
                        data = [data]
                    }
                    res.render('myItem', {product:data})
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    })

}




