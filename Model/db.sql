--Creation of products table - no need for indexes as only ever read from table. May later add functionalities for admin
CREATE TABLE products (
  id serial PRIMARY KEY,
  name varchar(50) NOT NULL,
  price decimal(12, 2) NOT NULL,
  category varchar(25) NOT NULL,
  quantity int,
  CHECK (quantity >= 0)
 );
 
 --Insert products table with mock data with mock data.
 INSERT INTO products (name, price, category, quantity)
 VALUES 
 	('Red T-shirt', 10, 'Shirts', 100),
  ('Blue T-shirt', 10, 'Shirts', 100),
  ('Red Chinos', 25, 'Trousers', 50),
  ('Blue Chinos', 25, 'Trousers', 50),
  ('Red Hat', 7.50, 'Hats', 25),
  ('Blue Hat', 7.50, 'Hats', 25);

--Creating users table
CREATE TABLE users (
  id serial PRIMARY KEY,
  email varchar(50) NOT NULL,
  password text NOT NULL,
  admin boolean NOT NULL,
  CHECK (length(password) > 5)
);

--Creating index on email as this will be heavily searched for.
CREATE INDEX idx_users_email ON users (email);

--Creating orders table
CREATE TABLE orders (
  id serial PRIMARY KEY,
  user_id int REFERENCES users(id),
  total decimal(12, 2) NOT NULL
);

--Creating orders_products table
CREATE TABLE orders_products (
  order_id int REFERENCES orders(id),
  product_id int REFERENCES products(id),
  quantity int NOT NULL,
  PRIMARY KEY (order_id, product_id),
  CHECK (quantity > 0)
);