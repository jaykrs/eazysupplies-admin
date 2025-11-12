export const MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    MISSING_FIELDS: "Missing required fields.",
    USER_EXISTS: (email) => `User already exists with ${email}`,
    USER_CREATED: "User created successfully",
    SERVER_ERROR: "Internal Server Error",
    DATA_EXISTS : "already exist",
    INVOICE_TEMPLATE : `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example 2</title>
    <style>
@font-face {
  font-family: SourceSansPro;
  src: url(SourceSansPro-Regular.ttf);
}
.clearfix:after { content: ""; display: table; clear: both; }
a { color: #0087C3; text-decoration: none; }
body {
  position: relative;
  width: 21cm;  
  height: 29.7cm; 
  margin: 0 auto; 
  color: #555555;
  background: #FFFFFF; 
  font-family: Arial, sans-serif; 
  font-size: 14px; 
  font-family: SourceSansPro;
}
header { padding: 10px 0; margin-bottom: 20px; border-bottom: 1px solid #AAAAAA; }
#logo { float: left; margin-top: 8px; }
#logo img { height: 70px; }
#company { float: right; text-align: right; }
#details { margin-bottom: 50px; }
#client { padding-left: 6px; border-left: 6px solid #0087C3; float: left; }
#client .to { color: #777777; }
h2.name { font-size: 1.4em; font-weight: normal; margin: 0; }
#invoice { float: right; text-align: right; }
#invoice h1 {
  color: #0087C3;
  font-size: 2.4em;
  line-height: 1em;
  font-weight: normal;
  margin: 0  0 10px 0;
}
#invoice .date { font-size: 1.1em; color: #777777; }
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
}
table th, table td {
  padding: 20px;
  background: #EEEEEE;
  text-align: center;
  border-bottom: 1px solid #FFFFFF;
}
table th { white-space: nowrap; font-weight: normal; }
table td { text-align: right; }
table td h3 {
  color: #57B223;
  font-size: 1.2em;
  font-weight: normal;
  margin: 0 0 0.2em 0;
}
table .no { color: #FFFFFF; font-size: 1.6em; background: #57B223; }
table .desc { text-align: left; }
table .unit { background: #DDDDDD; }
table .total { background: #57B223; color: #FFFFFF; }
table td.unit, table td.qty, table td.total { font-size: 1.2em; }
table tbody tr:last-child td { border: none; }
table tfoot td {
  padding: 10px 20px;
  background: #FFFFFF;
  border-bottom: none;
  font-size: 1.2em;
  white-space: nowrap; 
  border-top: 1px solid #AAAAAA; 
}
table tfoot tr:first-child td { border-top: none; }
table tfoot tr:last-child td {
  color: #57B223;
  font-size: 1.4em;
  border-top: 1px solid #57B223; 
}
table tfoot tr td:first-child { border: none; }
#thanks { font-size: 2em; margin-bottom: 50px; }
#notices { padding-left: 6px; border-left: 6px solid #0087C3; }
#notices .notice { font-size: 1.2em; }
footer {
  color: #777777;
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #AAAAAA;
  padding: 8px 0;
  text-align: center;
}
    </style>
  </head>
  <body>
    <header class="clearfix">
      <div id="logo">
        <img src="logo.png">
      </div>
      <div id="company">
        <h2 class="name">Company Name</h2>
        <div>455 Foggy Heights, AZ 85004, US</div>
        <div>(602) 519-0450</div>
        <div><a href="mailto:company@example.com">company@example.com</a></div>
      </div>
    </header>
    <main>
      <div id="details" class="clearfix">
        <div id="client">
          <div class="to">INVOICE TO:</div>
          <h2 class="name">John Doe</h2>
          <div class="address">796 Silver Harbour, TX 79273, US</div>
          <div class="email"><a href="mailto:john@example.com">john@example.com</a></div>
        </div>
        <div id="invoice">
          <h1>INVOICE 3-2-1</h1>
          <div class="date">Date of Invoice: 01/06/2014</div>
          <div class="date">Due Date: 30/06/2014</div>
        </div>
      </div>
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th class="no">#</th>
            <th class="desc">DESCRIPTION</th>
            <th class="unit">UNIT PRICE</th>
            <th class="qty">QUANTITY</th>
            <th class="total">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="no">01</td>
            <td class="desc"><h3>Website Design</h3>Creating a recognizable design solution based on the company's existing visual identity</td>
            <td class="unit">$40.00</td>
            <td class="qty">30</td>
            <td class="total">$1,200.00</td>
          </tr>
          <tr>
            <td class="no">02</td>
            <td class="desc"><h3>Website Development</h3>Developing a Content Management System-based Website</td>
            <td class="unit">$40.00</td>
            <td class="qty">80</td>
            <td class="total">$3,200.00</td>
          </tr>
          <tr>
            <td class="no">03</td>
            <td class="desc"><h3>Search Engines Optimization</h3>Optimize the site for search engines (SEO)</td>
            <td class="unit">$40.00</td>
            <td class="qty">20</td>
            <td class="total">$800.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2"></td><td colspan="2">SUBTOTAL</td><td>$5,200.00</td></tr>
          <tr><td colspan="2"></td><td colspan="2">TAX 25%</td><td>$1,300.00</td></tr>
          <tr><td colspan="2"></td><td colspan="2">GRAND TOTAL</td><td>$6,500.00</td></tr>
        </tfoot>
      </table>
      <div id="thanks">Thank you!</div>
      <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
      </div>
    </main>
    <footer>
      Invoice was created on a computer and is valid without the signature and seal.
    </footer>
  </body>
</html>
`
};
let orderSummaryHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Order Summary - eazysupplies.com</title>\n    <style>\n        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 20px; }\n        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }\n        h1 { color: #007bff; text-align: center; }\n        table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }\n        th { background-color: #f2f2f2; }\n        .total { font-weight: bold; }\n        .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <h1>Order Summary</h1>\n        <p>Thank you for your order with eazysupplies.com! Here are the details of your purchase:</p>\n        \n        <p><strong>Order Number:</strong> ORD-12345</p>\n        <p><strong>Order Date:</strong> October 10, 2023</p>\n        <p><strong>Shipping Address:</strong> 123 Business St, Suite 456, New York, NY 10001</p>\n        <p><strong>Billing Address:</strong> 123 Business St, Suite 456, New York, NY 10001</p>\n        \n        <h2>Items Ordered</h2>\n        <table>\n            <thead>\n                <tr>\n                    <th>Product</th>\n                    <th>Quantity</th>\n                    <th>Price</th>\n                    <th>Total</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td>Wholesale Office Supplies Kit</td>\n                    <td>2</td>\n                    <td>$50.00</td>\n                    <td>$100.00</td>\n                </tr>\n                <tr>\n                    <td>Industrial Cleaning Supplies</td>\n                    <td>1</td>\n                    <td>$30.00</td>\n                    <td>$30.00</td>\n                </tr>\n            </tbody>\n        </table>\n        \n        <p><strong>Subtotal:</strong> $130.00</p>\n        <p><strong>Shipping:</strong> $10.00</p>\n        <p><strong>Tax:</strong> $10.40</p>\n        <p class=\"total\"><strong>Total:</strong> $150.40</p>\n        \n        <p>Your order is being processed. You will receive a tracking number once it ships. If you have any questions, contact us at <a href=\"mailto:support@eazysupplies.com\">support@eazysupplies.com</a>.</p>\n        \n        <div class=\"footer\">The eazysupplies.com Team</div>\n    </div>\n</body>\n</html>";
