export const storageURL = process.env.storageURL;
export const SkuType = [
    { id: 'PACKET', name: 'PACKET' },
    { id: 'BAG', name: 'BAG' },
    { id: 'BOTTLE', name: 'BOTTLE' },
    { id: 'PLASTIC BOTTLE', name: 'PLASTIC BOTTLE' },
    { id: 'GLASS BOTTLE', name: 'GLASS BOTTLE' },
    { id: 'JERRY CAN', name: 'JERRY CAN' },
    { id: 'POUCH', name: 'POUCH' },
    { id: 'TIN', name: 'TIN' }
];
export const ConvertIntoIso8601 = function toISO8601(input) {
    if (!input) return null;

    let dateObj;

    if (input instanceof Date) {
        dateObj = input;
    } else if (typeof input === "string") {
        // If input is like "YYYY-MM-DDTHH:MM", append seconds
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) {
            input += ":00";
        }
        dateObj = new Date(input);
    } else {
        return null;
    }

    // Check if valid date
    if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", input);
        return null;
    }

    // Convert to ISO-8601 string in UTC
    return dateObj.toISOString();
}

export const OrderEmailTemp = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Summary - eazysupplies.com</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #007bff;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }

        .total {
            font-weight: bold;
        }

        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Order Summary</h1>

        <p>Thank you for your order with eazysupplies.com! Here are the details of your purchase:</p>

        <p><strong>Order Number:</strong> @Order</p>
        <p><strong>Order Date:</strong> @OrderDate</p>
        <p><strong>Shipping Address:</strong> @ShippingAddress</p>
        <p><strong>Payment Status:</strong> @PaymentStatus</p>

        <h2>Items Ordered</h2>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Dis(%)</th>
                    <th>Dis(amt)</th>
                    <th>Tax(%)</th>
                    <th>Tax(amt)</th>
                    <th>Sum</th>
                </tr>
            </thead>

            <!-- <tbody>
                <tr>
                    <td>Wholesale Office Supplies Kit</td>
                    <td>2</td>
                    <td>$50.00</td>
                    <td>$100.00</td>
                </tr>
                <tr>
                    <td>Industrial Cleaning Supplies</td>
                    <td>1</td>
                    <td>$30.00</td>
                    <td>$30.00</td>
                </tr>
            </tbody> -->
            <tbody>
            @ProductBody
            <tr><td></td><td></td><td></td><td></td><td></td><td></td><td>Total(₹):</td><td>@totalOrderAmount</td></tr>
            </tbody>
        </table>

    <!--    <p><strong>Subtotal:</strong> @SubTotal</p>
        <p><strong>Tax:</strong> @tax</p>

        <p class="total"><strong>Total:</strong> @Total</p> -->

        <p> 
            Your order is being processed. You will receive a tracking number once it ships.
            If you have any questions, contact us at
            <a href="mailto:support@eazysupplies.com">support@eazysupplies.com</a>.
        </p>

        <div class="footer">The eazysupplies.com Team</div>
    </div>
</body>
</html>

`

export const PaymentMethod = [
    {name:"Net Banking", id:"NB"},
    {name:"Debit Card", id:"DC"},
    {name:"Credit card", id:"CC"},
    {name:"Net Banking", id:"NB"},
    {name:"UPI(Unified Payments Interface)", id:"UPI"},
    {name:"Offline", id:"OFF"}
]

export const PaymentStatus = [
    {name:"PENDING", id:"PENDING"},
    {name:"SUCCESS", id:"SUCCESS"},
    {name:"FAILED", id:"FAILED"}
]