let db = require('../models');

module.exports = function(app){

    //Index page
    app.get("/", function(req,res) {
        db.Article.find({}).sort({created: -1})
        .populate("comments")
        .then((result)=> {
            let articleObj = {
                article: result
            }
            res.render("index", articleObj);
        })
    });

    //Saved articles page
    app.get("/saved", function(req,res){
        db.Article.find({"saved": true}).sort({created:-1})
        .populate("comments")
        .then((result) => {
            let articleObj = {
                article: result
            }
            res.render("saved", articleObj);
        })
    });
}