#CREATE database
CREATE database tigum_data;
#point to database

USE tigum_data;

#create


CREATE TABLE Users(
    user_id int PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(50) NOT NULL
);

CREATE TABLE Income(
    income_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    source VARCHAR(50) NOT NULL,
    amount FLOAT(10, 2) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    income_start_date DATE,
    end_date DATE,
    CONSTRAINT fk_user_id_in FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Expense_Categories(
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    category_name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user_id_cat FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

CREATE TABLE Expenses(
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    category_id INT,
    expense_description VARCHAR(255),
    amount FLOAT(10, 2) NOT NULL,
    expense_date DATE,
    CONSTRAINT fk_user_id_exp FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT fk_category_id_exp FOREIGN KEY (category_id) REFERENCES Expense_Categories(category_id)
);

CREATE TABLE Transactions(
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    transaction_type VARCHAR(50) NOT NULL,
    category_id INT,
    transaction_description VARCHAR(255),
    amount FLOAT(10, 2) NOT NULL,
    transcation_date DATE,
    CONSTRAINT fk_user_id_tran FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT fk_category_id_tran FOREIGN KEY (category_id) REFERENCES Expense_Categories(category_id)
);

CREATE TABLE Budgets(
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    category_id INT,
    amount FLOAT(10, 2) NOT NULL,
    budget_start_date DATE,
    end_date DATE,
    CONSTRAINT fk_user_id_bud FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT fk_category_id_bud FOREIGN KEY (category_id) REFERENCES Expense_Categories(category_id)
);

CREATE TABLE Goals(
    goal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    goals_description VARCHAR(255),
    target_amount FLOAT(10, 2) NOT NULL,
    target_date DATE,
    CONSTRAINT fk_user_id_goal FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Reminders(
    reminder_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    reminder_description VARCHAR(255),
    reminder_date DATE,
    frequency VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_id_rem FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Wallets(
    wallet_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    budget_id INT,
    balance FLOAT(10, 2),
    CONSTRAINT fk_user_id_wal FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT fk_budget_id_wal FOREIGN KEY (budget_id) REFERENCES Budgets(budget_id)
);