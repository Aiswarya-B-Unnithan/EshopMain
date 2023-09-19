// Define a function to print the invoice
function printInvoice() {
  // Get the generated invoice HTML
  const invoiceHtml = document.getElementById("invoiceContainer").innerHTML;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");

  // Write the HTML content to the print window
  printWindow.document.open();
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();

  // Trigger the print dialog in the print window
  printWindow.print();

  // Close the print window after printing
  printWindow.close();
}

// Wait for the DOM to fully load before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Attach the click event handler to the "Print Invoice" button
  document
    .getElementById("printInvoiceButton")
    .addEventListener("click", printInvoice);
});
