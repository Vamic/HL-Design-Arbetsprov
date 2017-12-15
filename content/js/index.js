$(document).ready(function () {
    /*
     * Products
     */
    
    var getProducts = function (options, isSearch) {
        var deferred = $.Deferred();
        
        //Build URL
        var requestUrl = "https://webshop.wm3.se/api/v1/shop/products";
        if (isSearch) {
            requestUrl += "/search";
        }
        requestUrl += ".json";
        
        //Add options
        var params = $.param(options);
        if (params) {
            requestUrl += "?" + params;
        }
        
        //Send back the result
        $.get(requestUrl, function (data) {
            deferred.resolve(data.products);
        });
        return deferred;
    };
    var searchProducts = function (search) {
        //Leave searchbar blank to go back to the initial items
        var isSearch = search.length > 0;
        options = {
            media_file: true,
            limit: 6
        };
        if (isSearch) {
            options.q = search;
        }
        getProducts(options, isSearch).then(function (products) {
            displayProducts(products);
        });
    };
    var displayProducts = function (products) {
        //Remove the shoes already displayed if theyre there
        $("#shoes").empty();
        
        //Create new shoe elements
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            var element = '<a class="shoe" href="#shoe-' + product.id + '">';
            element += '<img src="' + product.media_file.url_medium + '"/>';
            element += '<p>' + product.name + '</p>';
            element += '</a>';
            $("#shoes").append(element);
        }
    };    
    
    /*
     * Slideshow
     */
    
    var slideTimeout;
    var busy = false; 
    var slideTo = function (slide) {
        //In case it gets clicked when it switches, only allow one to run
        if (busy) return;
        busy = true;
        
        //Reset the time til next switch, also makes sure they dont stack
        clearTimeout(slideTimeout); 

        if (!slide) {
            //+1 to get the correct number for "nth", +1 again to get the next slide
            slide = $(".dot.current").index() + 2;
            //Loop it
            if (slide === 4)
                slide = 1;
        }
        
        //Fadeout, switch current classes, fade in new current
        $(".slide.current").fadeOut(250, function() {
            $(".current").removeClass("current");
            $(".slide:nth-of-type(" + slide + "), .dot:nth-of-type(" + slide + ")").addClass("current");
            $(".slide.current").fadeIn(500);
        });
        
        //Slide again in 5 seconds
        slideTimeout = setTimeout(function () {
            slideTo();
        }, 5000);
        
        busy = false;
    };
    
    /*
     * Events
     */
    
    $("#searchContainer > a").click(function () {
        searchProducts($("#search").val());
    });
    $("#search").keydown(function (event) {
        if (event.key === "Enter") {
            searchProducts($("#search").val());
        }
    });
    $(".dot").click(function (event) {
        slideTo($(this).index() + 1); //+1 for slide 1-3 instead of 0-2
    });
    
    
    /*
     * Initiate
     */
    
    slideTimeout = setTimeout(function () {
        slideTo(1);
    }, 0);
    
    var options = {
        media_file: true,
        limit: 6
    };
    getProducts(options).then(function (products) {
        displayProducts(products);
    });
});