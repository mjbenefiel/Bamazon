DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

-- Create a table called 'products' which will contain the store inventory --
CREATE TABLE products (
	product_id INTEGER (11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(90) NOT NULL,
	department_name VARCHAR(90) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(10) NOT NULL,
	PRIMARY KEY (product_id)
);

-- Insert data into the 'products' table --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Echo Dot', 'Amazon Devices', 49.99, 5000),
		('Fire TV Stick', 'Amazon Devices', 39.99, 3928),
		('TubShroom', 'Amazon Launchpad', 12.99, 13000),
		('Soylent Meal Replacement', 'Amazon Launchpad', 39.00, 503231);
		