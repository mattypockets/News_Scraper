let db = require('../models');
let axios = require("axios");
let cheerio = require("cheerio");
let mongojs = require("mongojs");

module.exports = function(app){
    
    // Scrape for new articles
    app.get("/scrape", function(req,res){
        axios.get("https://www.thetakeout.com").then(function(response){

        let $ = cheerio.load(response.data);

        $("article.postlist__item").each(function(i, element) {
            
            let title = $(element).find("header").find("a").first().text();
            let link = $(element).find("header").find("a").attr("href");
            let summary = $(element).find(".item__content").find(".entry-summary").find("p").first().text();
            let image = $(element).find(".item__content").find("figure").find("a").find(".img-wrapper").find("picture").find("source:nth-child(2)").attr("data-srcset")

            db.Article.create({
                title: title,
                link: link,
                summary: summary,
                image: image
            }). then(function(dbArticle){
                console.log(dbArticle);
            }) .catch(function(err){
                console.log(err);
            });
        });
        res.send("Scrape complete")
        })
    });

    // Create a new comment for an article
    app.post("/article/:id", function(req,res){
        db.Comment.create(req.body)
            .then(function(dbComment){
                return db.Article.findOneAndUpdate({_id: req.params.id}, { $push:{comments: dbComment._id}}, {new: true});
            }) .then(function(dbArticle){
                res.json(dbArticle);
            }) .catch(function(err){
                res.json(err);
            })
    })

    // Get all articles with all comments
    app.get("/populated", function(req,res){
        db.Article.find({})
        .populate("comments")
        .then((result) =>{
            res.json(result)
        }) .catch(function(err){
            res.json(err);
        })
    });

    // Delete a comment
    app.delete("/comment/:id", function(req,res){
        db.Comment.remove({"_id": req.params.id})
        .then(function(result){
            res.json(result)
        }) .catch(function(err){
            res.json(err)
        })
    })

    //Update when an article is saved
    app.put("/article/save/:id", function(req,res){
        db.Article.update({"_id": mongojs.ObjectId(req.params.id)}, {$set: {"saved":true}},
         function(err, data){
             if (err) {
                 console.log(err);
             } else {
                 res.json(data);
             }
         })
    })

    // Update when an article is unsaved
    app.put("/article/unsave/:id", function(req,res){
        db.Article.update({"_id": mongojs.ObjectId(req.params.id)}, {$set: {"saved": false}},
        function(err, data){
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        })
    })
}