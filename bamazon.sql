DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

-- Create a table called 'products' which will contain the store inventory --
CREATE TABLE products (
	product_id INTEGER (11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(90) NOT NULL,
	department_name VARCHAR(90) NOT NULL,
	price DECIMAL(6,3) NOT NULL,
	stock_quantity INTEGER(10) NOT NULL,
	PRIMARY KEY (product_id)
);



-- Insert data into the 'products' table --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Echo Dot', 'Amazon Devices', 49.99, 5000),
		('Fire TV Stick', 'Amazon Devices', 39.99, 3928),
		('Donkey Kong Country', 'Video Games', 19.99, 100),
		('Herbivore Botanicals Hydrating Face Mist', 'Beauty', 37.00, 4000),
		('HoodiePillow', 'Clothing', 25.00, 8000),
		('EchoGear Outlet Shelf', 'Devices', 15.00, 18000),
		('Clocky Alarm Clock on Wheels', 'Devices', 35.95, 5400),
		('LST Selfie Light', 'Beauty', 12.95, 54500),
		('TubShroom', 'Amazon Launchpad', 12.99, 13000),
		('Soylent Meal Replacement', 'Amazon Launchpad', 39.00, 503231);
		