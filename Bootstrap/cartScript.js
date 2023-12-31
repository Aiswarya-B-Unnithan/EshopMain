$(document).ready(function () {
  console.log("hello");
  // Attach event listener for the increment button
  $(".quantity-button[data-action='increase']").on("click", function (event) {
    event.preventDefault();
    const productId = $(this).data("productid");
    const stock = $(this).data("stock");
    console.log("stock", stock);

    const quantitySpan = $(`.quantity[data-productid="${productId}"]`);
    let currentQuantity = parseInt(quantitySpan.text());
    console.log(currentQuantity);

    if (currentQuantity >= stock) {
      // Show a confirmation alert
      Swal.fire({
        icon: "warning",
        title: "Stock is limited!",
        text: `You cannot add more than ${stock} items.`,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          // updateQuantity(productId, 1); // Increase quantity by 1
        }
      });
    } else {
      updateQuantity(productId, 1); // Increase quantity by 1
    }
    updateDiscountedTotal();
  });

  // Attach event listener for the decrement button
  $(".quantity-button[data-action='decrease']").on("click", function (event) {
    event.preventDefault();
    const productId = $(this).data("productid");
    const quantitySpan = $(`.quantity[data-productid="${productId}"]`);
    let currentQuantity = parseInt(quantitySpan.text());

    // Ensure the quantity doesn't go below 1
    if (currentQuantity > 1) {
      updateQuantity(productId, -1); // Decrease quantity by 1
    }
    updateDiscountedTotal();
  });
});

// Attach event listener for the delete button
$(".delete-button").on("click", async function () {
  const productId = $(this).data("productid");

  const result = await Swal.fire({
    title: "Remove item from cart",
    text: "Do you want to add this item to your wishlist or remove it completely?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Add to wishlist",
    cancelButtonText: "Remove",
  });
  // Handle the user's response
  if (result.isConfirmed) {
    console.log("yes");
    addToWishlist(productId);
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    deleteProduct(productId);
  }
});

// Function to add product to wishlist

async function addToWishlist(productId) {
  console.log("whishList");
  try {
    // Make an AJAX request to add the product to the wishlist
    const response = await $.ajax({
      url: "/wishlist/userWhishList",
      method: "POST",
      data: { productId },
    });
    deleteProduct(productId);

    Swal.fire(
      "Added to Wishlist",
      "The product has been added to your wishlist.",
      "success"
    );
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "An error occurred while adding to wishlist.", "error");
  }
}

function updateQuantity(productId, change) {
  const quantitySpan = $(`.quantity[data-productid="${productId}"]`);
  let currentQuantity = parseInt(quantitySpan.text());

  if (!isNaN(currentQuantity) && currentQuantity + change >= 0) {
    // Ensure quantity doesn't go negative
    currentQuantity += change;
    quantitySpan.text(currentQuantity);

    // Call the server to update the quantity
    $.ajax({
      url: `/cart/update-quantity/${productId}`,
      method: "PUT",
      data: { quantity: currentQuantity },
      success: function (response) {
        console.log(response);
        // Update the total price and other details here
        const cartItems = response.cart.items;

        const productid = productId;

        // Calculate the new total for the specific product and update the UI
        const updatedProduct = cartItems.find(
          (item) => item.product === productid
        );
        if (updatedProduct) {
          const newTotal = updatedProduct.quantity * updatedProduct.price;
          console.log("newTotal", newTotal);
          $(".price" + productid).text(`₹${newTotal.toFixed(2)}`);
        }

        // Update other details if needed
        $("#totalPrice").text(`₹ ${response.updatedTotalPrice.toFixed(2)}`);
        $("#totalAmountWithOutDiscount").text(
          `₹ ${response.updatedTotalAmountWithOutDiscount.toFixed(2)}`
        );

        $("#taxAmount").text(`₹ ${response.taxAmount.toFixed(2)}`);
        $("#totalAmountWithTax").text(
          `₹ ${response.totalAmountWithTax.toFixed(2)}`
        );
        $("#taxAmount").text(`₹ ${response.taxAmount.toFixed(2)}`);
        $("#totalAmountWithTax").text(
          `₹ ${response.totalAmountWithTax.toFixed(2)}`
        );

        // Update the discountedTotal here
        updateDiscountedTotal();
      },
      error: function (error) {
        console.log("Error updating quantity:", error);
      },
    });
  }
}

function deleteProduct(productId) {
  $.ajax({
    url: `/cart/delete/${productId}`,
    method: "DELETE",
    success: function (response) {
      // Remove the deleted product row from the cart table
      $(`tr[data-productid="${productId}"]`).remove();

      // Redirect to the cart page after successful deletion
      window.location.href = "/cart"; // Change the URL as needed
    },
    error: function (error) {
      console.log("Error deleting product:", error);
    },
  });
}
function showMessage(message) {
  // Find the message div and display the provided message
  const messageDiv = $("#message");
  messageDiv.text(message);

  // Hide the message after a few seconds (optional)
  setTimeout(function () {
    messageDiv.text("");
  }, 3000);
}
