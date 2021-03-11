const inquirer = require("inquirer");
const mySQL = require("mysql");
const consoleTable = require("console.table");

//creating connection to mySQL
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

//inital prompts for iuser input
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
        'Return to Main Menu',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.viewing) {
        case 'Employees':
          viewEmployees();
          break;

        case 'Roles':
          viewRoles();
          break;

        case 'Departments':
          viewDepartments();
          break;

        case 'Return to Main Menu':
          runSearch();
          break; 
 
        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.viewing}`);
          break;
      }
    });
};

const addToDB = () => {
    inquirer
    .prompt({
      name: 'adding',
      type: 'list',
      message: 'What would you like to add?',
      choices: [
        'Employees',
        'Roles',
        'Departments',
        'Return to Main Menu',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.adding) {
        case 'Employees':
          addEmployees();
          break;

        case 'Roles':
          addRoles();
          break;

        case 'Departments':
          addDepartments();
          break;

        case 'Return to Main Menu':
          runSearch();
          break; 
 
        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.adding}`);
          break;
      }
    });
};

const updateDB = () => {
    inquirer
    .prompt({
      name: 'updating',
      type: 'list',
      message: 'What would you like to update?',
      choices: [
        'Employees',
        'Roles',
        'Departments',
        'Return to Main Menu',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.updating) {
        case 'Employees':
          updateEmployees();
          break;

        case 'Roles':
          updateRoles();
          break;

        case 'Departments':
          updateDepartments();
          break;

        case 'Return to Main Menu':
          runSearch();
          break; 
 
        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.updating}`);
          break;
      }
    });
};
// TO DO: create joins for each function to allow results to be displayed 
// viewEmployees();
const viewEmployees = () => {
    const query =
      'SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name FROM ((employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id=departments.id));';
 
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res)
      runSearch();
    });
  };
  

const viewRoles = () => {
    const query =
    'SELECT roles.id, roles.title, roles.salary, departments.name FROM roles INNER JOIN departments ON roles.department_id = departments.id;';

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res)
    runSearch();
  });
};


// viewDepartments();
// addEmployees()
// addRoles()
// addDepartments()
// updateEmployees()
// updateRoles()
// updateDepartments()

