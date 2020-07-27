const express = require("express");
const router = express.Router();
const User = require("./User")
const Category = require("../categorie/categorie")
const bcrypt = require("bcryptjs")
const adminAuth = require("../middlewares/adminauth")



router.get("/admin/user/create", (req, res) => {
    Category.findAll().then((categories) => {

        res.render("admin/user/create", { categories: categories })
    })
})
router.post("/user/save", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then((user) => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            })
        } else {
            res.redirect("/admin/user/create")
        }
    })



})

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then((users) => {
        res.render("admin/user/users", {
            users: users
        })
    })
})

router.get("/login", (req, res) => {
    Category.findAll().then((categories) => {

        res.render("admin/user/login", { categories: categories })
    })
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then((user) => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password, user.password)

            if (correct) {
                req.session.user = { id: user.id, email: user.email }
                let emailOn = req.session.user;
                res.redirect("/admin/articles")
            } else { res.redirect("/login") }
        } else {
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/")
})
module.exports = router;