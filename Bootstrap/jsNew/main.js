(function ($) {
  ("use strict");

  /*[ Load page ]
    ===========================================================*/
  $(".animsition").animsition({
    inClass: "fade-in",
    outClass: "fade-out",
    inDuration: 1500,
    outDuration: 800,
    linkElement: ".animsition-link",
    loading: true,
    loadingParentElement: "html",
    loadingClass: "animsition-loading-1",
    loadingInner: '<div class="loader05"></div>',
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ["animation-duration", "-webkit-animation-duration"],
    overlay: false,
    overlayClass: "animsition-overlay-slide",
    overlayParentElement: "html",
    transition: function (url) {
      window.location.href = url;
    },
  });

  /*[ Back to top ]
    ===========================================================*/
  var windowH = $(window).height() / 2;

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > windowH) {
      $("#myBtn").css("display", "flex");
    } else {
      $("#myBtn").css("display", "none");
    }
  });

  $("#myBtn").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 300);
  });

  /*==================================================================
    [ Fixed Header ]*/
  var headerDesktop = $(".container-menu-desktop");
  var wrapMenu = $(".wrap-menu-desktop");

  if ($(".top-bar").length > 0) {
    var posWrapHeader = $(".top-bar").height();
  } else {
    var posWrapHeader = 0;
  }

  if ($(window).scrollTop() > posWrapHeader) {
    $(headerDesktop).addClass("fix-menu-desktop");
    $(wrapMenu).css("top", 0);
  } else {
    $(headerDesktop).removeClass("fix-menu-desktop");
    $(wrapMenu).css("top", posWrapHeader - $(this).scrollTop());
  }

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > posWrapHeader) {
      $(headerDesktop).addClass("fix-menu-desktop");
      $(wrapMenu).css("top", 0);
    } else {
      $(headerDesktop).removeClass("fix-menu-desktop");
      $(wrapMenu).css("top", posWrapHeader - $(this).scrollTop());
    }
  });

  /*==================================================================
    [ Menu mobile ]*/
  $(".btn-show-menu-mobile").on("click", function () {
    $(this).toggleClass("is-active");
    $(".menu-mobile").slideToggle();
  });

  var arrowMainMenu = $(".arrow-main-menu-m");

  for (var i = 0; i < arrowMainMenu.length; i++) {
    $(arrowMainMenu[i]).on("click", function () {
      $(this).parent().find(".sub-menu-m").slideToggle();
      $(this).toggleClass("turn-arrow-main-menu-m");
    });
  }

  $(window).resize(function () {
    if ($(window).width() >= 992) {
      if ($(".menu-mobile").css("display") == "block") {
        $(".menu-mobile").css("display", "none");
        $(".btn-show-menu-mobile").toggleClass("is-active");
      }

      $(".sub-menu-m").each(function () {
        if ($(this).css("display") == "block") {
          console.log("hello");
          $(this).css("display", "none");
          $(arrowMainMenu).removeClass("turn-arrow-main-menu-m");
        }
      });
    }
  });

  /*==================================================================
    [ Show / hide modal search ]*/
  $(".js-show-modal-search").on("click", function () {
    $(".modal-search-header").addClass("show-modal-search");
    $(this).css("opacity", "0");
  });

  $(".js-hide-modal-search").on("click", function () {
    $(".modal-search-header").removeClass("show-modal-search");
    $(".js-show-modal-search").css("opacity", "1");
  });

  $(".container-search-header").on("click", function (e) {
    e.stopPropagation();
  });

  var isotopeButton = $(".filter-tope-group button");

  $(isotopeButton).each(function () {
    $(this).on("click", function () {
      for (var i = 0; i < isotopeButton.length; i++) {
        $(isotopeButton[i]).removeClass("how-active1");
      }

      $(this).addClass("how-active1");
    });
  });

  /*==================================================================
    [ Filter / Search product ]*/
  $(".js-show-filter").on("click", function () {
    $(this).toggleClass("show-filter");
    $(".panel-filter").slideToggle(400);

    if ($(".js-show-search").hasClass("show-search")) {
      $(".js-show-search").removeClass("show-search");
      $(".panel-search").slideUp(400);
    }
  });

  $(".js-show-search").on("click", function () {
    $(this).toggleClass("show-search");
    $(".panel-search").slideToggle(400);

    if ($(".js-show-filter").hasClass("show-filter")) {
      $(".js-show-filter").removeClass("show-filter");
      $(".panel-filter").slideUp(400);
    }
  });

  /*==================================================================
  //   [ Cart ]*/
  // $(".js-show-cart").on("click", function () {
  //   $(".js-panel-cart").addClass("show-header-cart");
  // });

  // $(".js-hide-cart").on("click", function () {
  //   $(".js-panel-cart").removeClass("show-header-cart");
  // });

  /*==================================================================
  //   [ Cart ]*/
  // $(".js-show-sidebar").on("click", function () {
  //   $(".js-sidebar").addClass("show-sidebar");
  // });

  // $(".js-hide-sidebar").on("click", function () {
  //   $(".js-sidebar").removeClass("show-sidebar");
  // });

  /*==================================================================
    [ +/- num product ]*/
  $(".btn-num-product-down").on("click", function () {
    var numProduct = Number($(this).next().val());
    if (numProduct > 0)
      $(this)
        .next()
        .val(numProduct - 1);
  });

  $(".btn-num-product-up").on("click", function () {
    var numProduct = Number($(this).prev().val());
    $(this)
      .prev()
      .val(numProduct + 1);
  });

  /*==================================================================
    [ Rating ]*/
  $(".wrap-rating").each(function () {
    var item = $(this).find(".item-rating");
    var rated = -1;
    var input = $(this).find("input");
    $(input).val(0);

    $(item).on("mouseenter", function () {
      var index = item.index(this);
      var i = 0;
      for (i = 0; i <= index; i++) {
        $(item[i]).removeClass("zmdi-star-outline");
        $(item[i]).addClass("zmdi-star");
      }

      for (var j = i; j < item.length; j++) {
        $(item[j]).addClass("zmdi-star-outline");
        $(item[j]).removeClass("zmdi-star");
      }
    });

    $(item).on("click", function () {
      var index = item.index(this);
      rated = index;
      $(input).val(index + 1);
    });

    $(this).on("mouseleave", function () {
      var i = 0;
      for (i = 0; i <= rated; i++) {
        $(item[i]).removeClass("zmdi-star-outline");
        $(item[i]).addClass("zmdi-star");
      }

      for (var j = i; j < item.length; j++) {
        $(item[j]).addClass("zmdi-star-outline");
        $(item[j]).removeClass("zmdi-star");
      }
    });
  });

  /*==================================================================
    [ Show modal1 ]*/
  $(".js-show-modal1").on("click", function (e) {
    console.log("qucik");
    e.preventDefault();
    $(".js-modal1").addClass("show-modal1");
    var productId = $(this).data("product-id");
    console.log("productId", productId);
    // Make an AJAX request to fetch product details by ID
    $.ajax({
      type: "GET",
      url: `/quickViewproduct?productId=${productId}`,
      success: function (data) {
        console.log("data", data);
        $(".slick3.gallery-lb").empty();
        for (let i = 0; i < data[0].images.length; i++) {
          const imageUrl = data[0].images[i];
          const $slickItem = $('<div class="item-slick3"></div>'); // Create a new gallery item
          $slickItem.html(`
          <div
class="item-slick3"
                  data-thumb="${imageUrl}" 
                >
        <div class="wrap-pic-w pos-relative">
          <img src="${imageUrl}" alt="IMG-PRODUCT" />
          <a
            class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04"
            href="${imageUrl}"
          >
            <i class="fa fa-expand"></i>
          </a>
        </div>
      </div>
      `);
          $(".slick3.gallery-lb").append($slickItem);
        }

        // Populate the modal with the fetched product details
        $(".js-name-detail").text(data[0].productName);
        $(".js-price-detail").text("$" + data[0].price);
        $(".js-Offer-price-detail").text("$" + data[0].offerPrice);
        $(".js-stock-detail").text("$" + data[0].stock);
        $(".js-description-detail").text(data[0].description);

        // Inside the success callback of your AJAX request
        $("#productId").val(data[0]._id); // Set the product ID
        $("#price").val(data[0].price); // Set the price
        $("#offerPrice").val(data[0].offerPrice); // Set the offer price
        // Show the modal
        $(".js-modal1").fadeIn(500);

        // Construct the URL with query parameters
        const productId = $("#productId").val();
        const price = $("#price").val();
        const offerPrice = $("#offerPrice").val();
        const quantity = $("#quantity").val();
        const formAction = `/cart/${productId}?price=${price}&offerPrice=${offerPrice}&quantity=${quantity}`;
        // Set the form's action attribute dynamically
        $("#addToCartForm").attr("action", formAction);
      },
      error: function (error) {
        console.log("error", error);
      },
    });
  });

  $(".js-hide-modal1").on("click", function () {
    $(".js-modal1").removeClass("show-modal1");
  });
})(jQuery);
