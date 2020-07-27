const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const { static } = require("express");
const connection = require("./database/connection")
const categoriesController = require("./categorie/categoriescontroller")
const articleController = require("./articles/articleController")
const Category = require("./categorie/categorie.js")
const Article = require("./articles/article")
const userController = require("./user/userController")
const User = require("./user/User")
const session = require("express-session")
const adminAuth = require("./middlewares/adminauth")
    //Database
connection.authenticate().then(() => {
    console.log("Banco Conectado")
}).catch((error) => {
    console.log("Erro: " + error)
})

Category.sync({ force: false })
Article.sync({ force: false })
User.sync({ force: false })

//View Engine
app.set("view engine", "ejs");

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Static
app.use(express.static('public'));
app.use(session({
        secret: "blogresponsivo#12399883",
        cookie: { maxAge: 300000 }
    }))
    //Rotas
app.use("/", categoriesController);
app.use("/", articleController);
app.use("/", userController)


app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll().then((categories) => {

            res.render("index", { articles: articles, categories: categories })
        })

    })
})


app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({ where: { slug: slug } }).then((category) => {
        if (category != undefined) {
            Article.findAll({ where: { CategoryId: category.id } }).then((article) => {
                Category.findAll().then((categories) => {
                    res.render("category", {
                        categories: categories,
                        category: category,
                        article: article
                    })

                })

            })
        } else {
            Article.findOne({ where: { slug: slug } }).then((article) => {
                if (article != undefined) {
                    Category.findAll().then((categories) => {
                        res.render("article", {
                            categories: categories,
                            article: article
                        })
                    })
                } else {
                    res.redirect("/")
                }
            })
        }
    }).catch((erro) => {
        res.redirect("/")
    })

})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({ where: { slug: slug } }).then((article) => {
        if (article != undefined) {
            res.render("article", {
                article: article
            })
        } else {
            res.redirect("/")
        }
    })

})




app.listen(8089, console.log("O servidor está rodando"));