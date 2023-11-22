#create database
CREATE DATABASE tigum_data;
#point to database

USE tigum_data;

#create

CREATE TABLE `users`(
    user_id int PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE `budget`(
    budget_id int PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    budget_name VARCHAR(50) NOT NULL,
    budget_amount float(10,2) NOT NULL,
    budget_start_date date DEFAULT NULL,
    budget_end_date date DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE `expenses`(
    expense_id int PRIMARY KEY AUTO_INCREMENT,
    budget_id int,
    expense_name VARCHAR(50) NOT NULL,
    expense_amount float(10,2) NOT NULL,
    expense_date date DEFAULT NULL,
    FOREIGN KEY (budget_id) REFERENCES budget(budget_id)
);
 
CREATE TABLE `savings`(
    savings_id int PRIMARY KEY AUTO_INCREMENT,
    budget_id int,
    savings_name VARCHAR(50) NOT NULL,
    savings_amount float(10,2) NOT NULL,
    savings_date date DEFAULT NULL,
    FOREIGN KEY (budget_id) REFERENCES budget(budget_id)
);

CREATE TABLE `reminders`(
    reminder_id int PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    reminder_name VARCHAR(50) NOT NULL,
    reminder_description VARCHAR(255) NOT NULL,
    reminder_date date DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);