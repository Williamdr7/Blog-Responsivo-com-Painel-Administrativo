const express = require("express")
const router = express.Router();
const Category = require("./categorie")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminauth")

router.get("/admin/categories", adminAuth, (req, res) => {

    Category.findAll().then(categories => {

        res.render("admin/categories/index", {
            categories: categories
        })
    })
})

router.post("/categories/delete", (req, res) => {
    var id = req.body.id

    if (id != undefined) {

        if (!isNaN(id)) {

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        } else {
            res.redirect("/admin/categories")
        }
    } else {
        res.redirect("/admin/categories")
    }
})
router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("./admin/categories/new")
})

router.post("/categories/save", (req, res) => {

    var title = req.body.titulo

    if (title != undefined) {

        Category.create({
            titulo: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        })

    } else {
        res.redirect("/admin/categories/new")
    }
})
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id

    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then((category) => {
        if (category != undefined) {
            res.render("admin/categories/edit", { category: category })

        } else {
            res.redirect("/admin/categories")
        }
    })

})

router.post("/categories/update", (req, res) => {
    var id = req.body.id
    var titulo = req.body.titulo

    Category.update({ titulo: titulo, slug: slugify(titulo) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})
module.exports = router;