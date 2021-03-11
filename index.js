const inquirer = require("inquirer");
const mySQL = require("mysql");
const consoleTable = require("console.table");

const connection = mySQL.createConnection({

    host:"localhost",
    PORT:3306,
    user: "root",
    password: "Sc00byD00",
    database: "employee_tracker",

});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
  });

  const runSearch = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do with the employee tracker database?',
        choices: [
          'View',
          'Add',
          'Update',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View':
            viewDB();
            break;
  
          case 'Add':
            addToDB();
            break;
  
          case 'Update':
            updateDB();
            break;
   
          case 'Exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };
   
  const viewDB = () => {
    inquirer
    .prompt({
      name: 'viewing',
      type: 'list',
      message: 'What would you like to view?',
      choices: [
        'Employees',
        'Roles',
        'Departments',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Employees':
          viewEmployees();
          break;

        case 'Roles':
          viewRoles();
          break;

        case 'Departments':
          viewDepartments();
          break;
 
        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};
   
viewEmployees(); 
viewRoles();
viewDepartments();


addToDB();
updateDB();