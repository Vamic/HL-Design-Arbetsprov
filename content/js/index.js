$(document).ready(function () {
    var getProducts = function (options, isSearch) {
        // return;
        var deferred = $.Deferred();
        var requestUrl = "https://webshop.wm3.se/api/v1/shop/products";
        if (isSearch) {
            requestUrl += "/search";
        }
        requestUrl += ".json";
        var params = $.param(options);
        if (params) {
            requestUrl += "?" + params;
        }
        $.get(requestUrl, function (data) {
            console.log(data.products);
            deferred.resolve(data.products);
        });
        return deferred;
    };
    var searchProducts = function (search) {
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
        $("#shoes").empty();
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            var element = '<a id="' + product.id + '" class="shoe" href="#shoe-' + product.id + '">';
            element += '<img src="' + product.media_file.url_medium + '"/>';
            element += '<p>' + product.name + '</p>';
            element += '</a>';
            $("#shoes").append(element);
            if ((i + 1) % 3 === 0) {
                $("#shoes").append("<br/>");
            }
        }
    };
    var options = {
        media_file: true,
        limit: 6
    };
    getProducts(options).then(function (products) {
        displayProducts(products);
    });

    var slideTimeout = setTimeout(function () {
        slideTo(1);
    }, 0);
    var slideTo = function (slide) {
        clearTimeout(slideTimeout);

        if (!slide) {
            slide = $(".dot.current").index() + 2;
            if (slide === 4)
                slide = 1;
        }
        $(".slide.current").hide();
        $(".current").removeClass("current");
        $(".slide:nth-of-type(" + slide + "), .dot:nth-of-type(" + slide + ")").addClass("current");
        $(".slide:nth-of-type(" + slide + ")").fadeIn(500);

        slideTimeout = setTimeout(function () {
            slideTo();
        }, 5000);
    };

    $("#searchContainer > a").click(function () {
        searchProducts($("#search").val());
    });
    $("#search").keydown(function (event) {
        if (event.key === "Enter") {
            searchProducts($("#search").val());
        }
    });
    $(".dot").click(function (event) {
        slideTo($(this).index() + 1);
    });
});