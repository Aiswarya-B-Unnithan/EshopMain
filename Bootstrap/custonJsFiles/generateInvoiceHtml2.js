const PDFDocument = require("pdfkit");
const fs = require("fs");

const pdf = require("html-pdf");
const generateInvoicepdf1 = function (order) {
  const invoiceHtml = `
    <html>
    <head>
    <style>
    body {
      font-family: Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    </style>
    </head>
    <body>
    <h1>Invoice for Order #${order._id}</h1>
    <p>Order Date: ${order.orderDate}</p>
    <p>Customer Name: ${order.user.username}</p>
    <p>Shipping Address: ${order.deliveringAddress.address1}</p>
    <h2>Order Items:</h2>
    <table>
    <thead>
    <tr>
    <th>Product Name</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
    </tr>
    </thead>
    <tbody>
    ${order.cartItems
      .map(
        (item) => `
      <tr>
      <td>${item.product.productName}</td>
      <td>${item.product.price}</td>
      <td>${item.quantity}</td>
      <td>${item.product.price * item.quantity}</td>
      </tr>
    `
      )
      .join("")}
    </tbody>
    </table>
    <h3>Total Amount: ${order.totalAmount}</h3>
    </body>
    </html>
    `;

  return invoiceHtml;
};

module.exports = generateInvoicepdf1;
