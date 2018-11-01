var inquirer = require("inquirer");
var mysql = require("mysql");
var figlet = require("figlet");
var chalk = require("chalk");
require("dotenv").config()

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

let bamazonFig = "Bamazon";
figlet(bamazonFig, function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(chalk.hex('#146eb4')(data));
	//Welcome screen text.
	console.log(chalk.hex('#146eb4')(" Welcome to Bamazon."));
	console.log(chalk.hex('#146eb4')(" See the same 10 items, every day.\n"));

});

function displayInventory() {
    queryStr = 'SELECT * FROM products';


    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log(" Existing Inventory:");
        console.log(chalk.hex('#760ce8')("---------------------------------------------------------------------\n"));


        for (var i = 0; i < data.length; i++) {
            var strOut = '';
            strOut += (chalk.hex('#ff9900')(' Product ID: ' + data[i].product_id + ' // '));
            strOut += (chalk.hex('#ff9900')(' Product Name: ' + data[i].product_name + ' // '));
            strOut += (chalk.hex('#ff9900')(' Department: ' + data[i].department_name + ' // '));
            strOut += (chalk.hex('#ff9900')(' Price: $' + data[i].price + '\n'));


            console.log(strOut)
        }
        console.log(chalk.hex('#760ce8')("---------------------------------------------------------------------\n"));

        promptPurchase();
    })
}

function promptPurchase() {

    inquirer.prompt([{
            type: 'input',
            name: 'product_id',
            message: 'Please enter the item ID you would like to purchase.',
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many items do you need?',
            validate: validateInput,
            filter: Number

        }

    ]).then(function (input) {

        var item = input.product_id;
        var quantity = input.quantity;

        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {
                product_id: item
            }, function (err, data) {
                if (err) throw err;


                if (data.length === 0) {
                    console.log(chalk.hex('#FF0000')("\n Error: Please select valid item ID\n"));
                    displayInventory();
                } else {
                    var productData = data[0];

                    if (quantity <= productData.stock_quantity) {
                        console.log(chalk.hex('#146eb4')('\n This item is in stock. Placing order now.\n'));

                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE product_id = ' + item;

                        connection.query(updateQueryStr, function (err, data) {
                            if (err) throw err;


                            console.log(chalk.hex('#146eb4')(' Your total is $' + truncateNumber(productData.price * quantity, 2)));
                            console.log(chalk.hex('#146eb4')('\n Thank you for shopping with Bamazon.'));
                            console.log(chalk.hex('#760ce8')("\n---------------------------------------------------------------------\n"));

                            connection.end()


                        });

                    } else {
                        console.log(chalk.hex('#FF0000')('\n Sorry, your cannot be placed. There is not enough product in stock.\n'));
                        console.log(chalk.hex('#FF0000')(' Please modify your order.'));
                        console.log(chalk.hex('#760ce8')("\n---------------------------------------------------------------------\n"));

                        displayInventory();
                    }
                }

            }

        )


    })


}

//Used for trailing zero edge cases
function truncateNumber(num, precision) {
    let c = Math.pow(10, precision);
    return Math.trunc(num * c) / c;
}


function validateInput(val) {
    var integer = Number.isInteger(parseFloat(val));
    var sign = Math.sign(val);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole number greater than zero'
    }

}


displayInventory();