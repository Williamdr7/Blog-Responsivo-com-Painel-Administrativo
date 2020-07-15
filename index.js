const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const { static } = require("express");
const connection = require("./database/connection")
const categoriesController = require("./categorie/categoriescontroller")
const articleController = require("./articles/articleController")
const Category = require("./categorie/categorie.js")
const Article = require("./articles/article")

//Database
connection.authenticate().then(() => {
    console.log("Banco Conectado")
}).catch((error) => {
    console.log("Erro: " + error)
})

Category.sync({ force: false })
Article.sync({ force: false })

//View Engine
app.set("view engine", "ejs");

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Static
app.use(express.static('public'));


//Rotas
app.use("/", categoriesController)
app.use("/", articleController)
app.get('/', (req, res) => {
    res.render("index")
})

app.listen(8089, console.log("O servidor está rodando"));