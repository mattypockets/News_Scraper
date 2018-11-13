var express = require("express");
var mongoose = require("mongoose");

// Node scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

app.listen(PORT, function(){
    console.log("Application running on port " + PORT)
});