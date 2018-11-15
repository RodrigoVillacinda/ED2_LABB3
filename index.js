'use strict'

const express  = require('express') 
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Product = require('./models/product')

const app  = express()
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var jwt = require('jsonwebtoken')
 

app.get('/api/product/token', (req, res) => {

    function generateToken(user) {
        var u = {
         username: user.username,
         id: user.id
        }
        return token = jwt.sign(u, 'password', {
           expiresIn: 60 * 60 * 24 // expires in 24 hours
        })
      }

    })
//--------------------------Todos los productos----------------------------------
app.get('/api/product', (req, res) => {

    Product.find({}, (err, products)=>{
    
        if(err) return res.status(500).send({ message: `Error al realizar la peticióm ${err}`}) //mensaje de error 
        if(!products) return res.status(404).send({message:`No existen productos`}) 
        res.send(200, { products })
    })

    
} )

//----------------------------------producto en especifico---------------------------------
app.get('/api/product/:productId', (req, res) => {
   let productId = req.params.productId

   Product.findById(productId, (err, product) => {
       if(err) return res.status(500).send({ message: `Error al realizar la peticióm ${err}`})
       if(!product) return res.status(404).send({message:`El producto no existe`}) 
   
       res.status(200).send({ product })
   
    })
})

//-------------------------------------envia---------------------------------
app.post('/api/product', (req, res) =>{
  console.log('POST /api/produt')
  console.log(req.body)

  let product = new Product()

  product.nombre = req.body.nombre
  product.descripcion = req.body.descripcion
  product.masa = req.body.masa
  product.porciones = req.body.porciones
  product.queso = req.body.queso
 
  product.save((err, productStored) => {
      if(err) res.status(500, { message:  `Error al salvar en la base de datos: ${err}`})

      res.status(200).send({product: productStored})

  })
})

//------------------------------------------Actualizar---------------------------------------
app.put('/api/product/:productId' , (req, res) => {
    let productId = req.params.productId //accedemos al product id
    let update = req.body

    Product.findByIdAndUpdate(productId, update, (err, productUpdate) =>{
        if(err) res.status(500).send({message: `Error al actulizar el producto ${err}`})

        res.status(200).send({ product: productUpdate })
        
    })
})

//------------------------Elimina un producto-------------------------------
app.delete('/api/product/:productId' , (req, res) => {

    let productId = req.params.productId //acceder al id del producto

    Product.findById(productId, (err, product) => { //collback
        if(err) res.status(500).send({message: `Error al borrar el producto ${err}`})

        product.remove(err => {
        if(err) res.status(500).send({message: `Error al borrar el producto ${err}`})
        res.status(200).send({message: `El producto a sido elminido
        `})
            
        })
    }) //propiedad de mongoose
})


//--------------------conexión a la base de datos-----------------------
mongoose.connect('mongodb://localhost:27017/shop', (err, res) => {
    if(err) {
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }
    console.log('Conexión a la base de datos establecida')

    app.listen(port, () => {
        console.log(`API REST corriendo en http//localhost:${port}`)
    } )

})
