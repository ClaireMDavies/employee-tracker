const inquirer = require("inquirer");
const mySQL = require("mysql");
const consoleTable = require("console.table");

const connection = mySQL.createConnection({

    host:"localhost",
    PORT:3306,
    user: "root",
    password: "Sc00byD00",
    database: "employee_trackerDB",

});