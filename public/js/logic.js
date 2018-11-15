$(document).ready(function(){
    $('.collapsible').collapsible();
    $('.sidenav').sidenav();

    //Add a Favorite Star after each article.
    $.ajax({
        method: "GET",
        url: "/populated"
    }).then(function(data){
        data.forEach(
            function(result){
        
            // If the article has not been saved, only the outline of a star shows
            if (result.saved === false) {
                $('[data-titleid="' + result._id + '"]').append('<i data-id=' + result._id + ' class="material-icons notSelected">star_border</i>');
            } 
            // If the article has been saved, the star is filled out
            else {
                $('[data-titleid="' + result._id + '"]').append('<i data-id=' + result._id + ' class="material-icons selected">star</i>');
            }
        })
    })

    //If the article is saved, update saved to equal true
    $(document.body).on("click", ".notSelected", function(){
        $(this).text("favorite");
        $(this).removeClass("notSelected");
        $(this).addClass("selected");
        let id = $(this).attr("data-id");

        $.ajax({
            method: "PUT",
            url: "/article/save/" + id
        }).then(function(data){
            location.reload();
        })
        
    });

    //If the article is unsaved, update saved to equal false
    $(document.body).on("click", ".selected", function(){
        $(this).text("favorite_border");
        $(this).removeClass("selected");
        $(this).addClass("notSelected");
        let id = $(this).attr("data-id");

        $.ajax({
            method: "PUT",
            url: "/article/unsave/" + id
        }).then(function(data){
            location.reload();
        })
        
    });

    //creates a new comment
    $(document).on("submit", ".commentSubmit", function(){
        let id = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/article/" + id,
            data: {
                text: $("#" + id).val()
            }
        }).then(function(data){
            console.log(data);
            location.reload();
        })
    })

    // Delete comment functionality
    $(document).on("click", ".delete", function(){
        let id = $(this).attr("data-id");

        $.ajax({
            method: "DELETE",
            url: "/comment/" +id
        }).then(function(){
            console.log("comment deleted")
            location.reload();
        })
    })

    // Add functionality to scrape for new articles
    $(document).on("click", ".scrape", function(){
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function(data){
            location.reload()
        })
    })



})