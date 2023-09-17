// Function to sort products by name (a-z or z-a) or price (asc or desc)
function sortProductsBy(field, order) {
  console.log("hello", field, order);
  console.log("filter");
  fetch(`/sortProducts?field=${field}&order=${order}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      // Update the product list with the sorted results
      updateProductList(data);
    })
    .catch((error) => console.error("Error:", error));
}
// Function to update the product list based on search and sort results
function updateProductList(products) {
  const productListContainer = document.getElementById("productList");
  productListContainer.innerHTML = "";

  if (products.length === 0) {
    // Show a message when no products are found
    productListContainer.innerHTML = "<p>No products found.</p>";
  } else {
    products.forEach((product) => {
      console.log("each product", product);
      // Generate the product HTML and append it to the container

      // Generate the product HTML and append it to the container
      const productHTML = `
		  
      <div class="row" id="productList">
               <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
             
            <!-- Block2 -->
					<div class="block2">
						<div class="block2-pic hov-img0">
						  <img src="/${product.images[0]}" alt="IMG-PRODUCT">
                          <a href="#" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1" data-product-id="{{_id}}">
                          Quick View
                          </a>
						</div>
						<div class="block2-txt flex-w flex-t p-t-14">
							<div class="block2-txt-child1 flex-col-l ">
								<a href="/${product.images[0]}" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
									${product.productName}
								</a>
                                
                                
                                <span class="stext-105 cl3">
									₹${product.price}}
								</span>
                                
							</div>

							<div class="block2-txt-child2 flex-r p-t-3">
								<a href="#" class="btn-addwish-b2 dis-block pos-relative js-addwish-b2" data-product-id="${product._id}">
									<img class="icon-heart1 dis-block trans-04" src="/Bootstrap/imagesNew/icons/icon-heart-01.png" alt="ICON">
									<img class="icon-heart2 dis-block trans-04 ab-t-l" src="/Bootstrap/imagesNew/icons/icon-heart-02.png" alt="ICON">
								</a>
							</div>
						</div>
                        
                        
					</div>
				     </div>
				 
                     
		    </div>
		`;
      productListContainer.insertAdjacentHTML("beforeend", productHTML);
    });
  }
}

// Add event listeners to the sort buttons

document
  .getElementById("sortLowToHigh")
  .addEventListener("click", () => sortProductsBy("price", "asc"));
document
  .getElementById("sortHighToLow")
  .addEventListener("click", () => sortProductsBy("price", "desc"));
