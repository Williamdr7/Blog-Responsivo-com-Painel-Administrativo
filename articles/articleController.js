const express = require("express")
const router = express.Router();
const Category = require("../categorie/categorie")
const Article = require("./article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminauth")

router.get("/admin/articles", adminAuth, (req, res) => {
    var email = req.session.user.email;
    Article.findAll({ include: [{ model: Category }] }).then((articles) => {
        res.render("./admin/articles/index", {
            articles: articles,
            email: email
        })

    })
})

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id

    if (isNaN(id)) {
        res.redirect("/admin/articles")
    }
    Article.findByPk(id).then((article) => {
        if (article != undefined) {
            res.render("admin/articles/edit", { article: article })

        } else {
            res.redirect("/admin/articles")
        }
    })

})

router.get("/articles/page/:num", (req, res) => {
    var num = req.params.num
    var offset = 0;

    if (isNaN(num) || num == 1) {
        offset = 0
    } else {
        offset = parseInt((num) - 1) * 4
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        var next;
        if (offset + 4 >= articles.count) {
            next = false
        }
        var result = {
            page: parseInt(num),
            next: next,
            articles: articles
        }

        Category.findAll().then((categories) => {

            res.render("admin/articles/page", {

                result: result,
                categories: categories,


            }).catch((erro) => {
                console.log(erro)
            })
        }).catch((erro) => {
            console.log(erro)
        })
    })



})



router.post("/articles/update", (req, res) => {
    var id = req.body.id
    var titulo = req.body.titulo
    var body = req.body.body

    Article.update({ titulo: titulo, slug: slugify(titulo), body: body }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) => {

    Category.findAll().then((categories) => {
        res.render("admin/articles/new", {
            categories: categories
        })

    })
})

router.post("/articles/save", (req, res) => {
    var titulo = req.body.titulo;
    var body = req.body.body;
    var category = req.body.category


    Article.create({
        titulo: titulo,
        body: body,
        slug: slugify(titulo),
        CategoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch((erro) => {
        console.log(erro)
    })
})

router.post("/articles/delete", (req, res) => {
    var id = req.body.id

    if (id != undefined) {

        if (!isNaN(id)) {

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        } else {
            res.redirect("/admin/articles")
        }
    } else {
        res.redirect("/admin/articles")
    }
})
module.exports = router;