const authController = require('./authController')
const productController = require('./productController')



module.exports = function(app) {
    authController(app)
    productController(app)
    
}

