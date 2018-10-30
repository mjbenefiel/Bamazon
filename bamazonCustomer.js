// Pull in required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');
require('dotenv').config()

// Define the MySQL connection parameters
var connection = mysql.createConnection({
    host: process.env.BAMAZON_HOST,
    port: 3306,
    user: process.env.BAMAZON_USER,
    password: process.env.BAMAZON_PASS,
    database: 'bamazon'
})

connection.connect(function (err) {
    if (err) throw err
    validateInput()
})

function displayInventory() {
		// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Product ID: ' + data[i].product_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	promptUserPurchase();
	})
}

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole number greater than zero.';
	}
}

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase
function promptUserPurchase() {
	// console.log('___ENTER promptUserPurchase___');

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_id',
			message: 'Please enter the Item ID which you would like to purchase.',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {
		// console.log('Customer has selected: \n    product_id = '  + input.product_id + '\n    quantity = ' + input.quantity);

		var item = input.product_id;
		var quantity = input.quantity;

		// Query db to confirm that the given item ID exists in the desired quantity
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {product_id: item}, function(err, data) {
			if (err) throw err;

			// If the user has selected an invalid item ID, data attay will be empty
			// console.log('data = ' + JSON.stringify(data));

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productData = data[0];

				// console.log('productData = ' + JSON.stringify(productData));
				// console.log('productData.stock_quantity = ' + productData.stock_quantity);

				// If the quantity requested by the user is in stock
				if (quantity <= productData.stock_quantity) {
					console.log('Your item is in stock! Placing order now.');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE product_id = ' + item;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Success! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with Bamazon.');
						console.log("\n---------------------------------------------------------------------\n");
												// End the database connection
						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order cannot be placed.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInventory();
					
				}
			}
		})
	})
}

// displayInventory will retrieve the current inventory from the database and output it to the console
// runBamazon will execute the main application logic
function runBamazon() {
	// console.log('___ENTER runBamazon___');

	// Display the available inventory
	displayInventory();
}

// Run the application logic
runBamazon();

