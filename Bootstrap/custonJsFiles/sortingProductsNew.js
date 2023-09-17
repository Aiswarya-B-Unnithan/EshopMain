$(document).ready(function () {
  // Initialize Isotope
  var $grid = $(".isotope-grid").isotope({
    itemSelector: ".isotope-item",
    layoutMode: "fitRows",
  });

  // Sort buttons
  $("#lowToHighSort").on("click", function () {
    sortProducts(true);
  });

  $("#highToLowSort").on("click", function () {
    sortProducts(false);
  });

  function sortProducts(ascending) {
    const sortedItems = $grid
      .find(".isotope-item")
      .toArray()
      .sort(function (a, b) {
        const priceA = parseFloat(
          $(a).find(".stext-105.cl3").text().replace("₹", "").trim()
        );
        const priceB = parseFloat(
          $(b).find(".stext-105.cl3").text().replace("₹", "").trim()
        );

        return ascending ? priceA - priceB : priceB - priceA;
      });

    $grid.isotope("updateSortData").isotope({ sortBy: "price" });
    $grid.isotope({ filter: "*" }).isotope("updateSortData");
    $grid.isotope("updateSortData").isotope();
  }
});
