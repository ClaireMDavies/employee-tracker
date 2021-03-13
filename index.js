const inquirer = require("inquirer");
const mySQL = require("mysql");
const consoleTable = require("console.table");

//creating connection to mySQL
const connection = mySQL.createConnection({

    host: "localhost",
    PORT: 3306,
    user: "root",
    password: "P4ssw0rd",
    database: "employee_tracker",

});

connection.connect((err) => {
    if (err) throw err;
    mainMenu();
});

//inital prompts for user input
const mainMenu = () => {
    inquirer
        .prompt({
            name: 'action',
            pageSize: 20,
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all employees by role',
                'View all employees by department',
                'View all employees by manager',
                new inquirer.Separator(),
                'Add employee',
                'Remove employee',
                'Update employee role',
                'Update employee manager',
                new inquirer.Separator(),
                'Add department',
                'Update department',
                'Remove department',
                new inquirer.Separator(),
                'Add role',
                'Remove role',
                new inquirer.Separator(),
                'Exit'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all employees':
                    viewEmployees();
                    break;

                case 'View all employees by role':
                    viewEmployeeRoles();
                    break;

                case 'View all employees by department':
                    viewEmployeeDepartments();
                    break;

                case 'View all employees by manager':
                    viewEmployeeManagers();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'Add role':
                    addRole();
                    break;

                case 'Add department':
                    addDepartment();
                    break;

                case 'Update employee role':
                    updateEmployee();
                    break;

                case 'Update employee manager':
                    updateManager();
                    break;

                case 'Update department':
                    updateDepartment();
                    break;

                case 'Remove employee':
                    removeEmployee();
                    break;

                case 'Remove role':
                    removeRole();
                    break;

                case 'Remove department':
                    removeDepartment();
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


const viewEmployees = () => {
    const query =
        'select employees.id AS "Employee Id", CONCAT(employees.first_name, " ", employees.last_name) AS "Full Name", roles.title AS "Role", roles.salary AS "Salary", departments.name as "Department", CONCAT(managers.first_name, " ", managers.last_name) AS "Manager" from employees join roles on employees.role_id = roles.id join departments on roles.department_id = departments.id join employees managers ON employees.manager_id = managers.id order by employees.last_name ASC';

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        mainMenu();
    });
};






const viewEmployeeRoles = () => {

    connection.query('SELECT id, title FROM roles', function (error, rows) {

        const roles = rows.map(row => ({ value: row.id, name: row.title }));

        const rolesMenu = [
            {
                type: 'list',
                name: 'role_id',
                message: "Choose a role:",
                choices: roles
            }
        ];

        inquirer.prompt(rolesMenu).then((answers) => {

            var query = `select roles.title AS "Role", departments.name as "Department", CONCAT(employees.first_name, " ", employees.last_name) AS "Full Name",  roles.salary AS "Salary",  CONCAT(managers.first_name, " ", managers.last_name) AS "Manager" from employees join roles on employees.role_id = roles.id join departments on roles.department_id = departments.id join employees managers ON employees.manager_id = managers.id where roles.id = ? order by employees.last_name ASC`;

            connection.query(query, [answers.role_id], function (error, rows) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("\n");
                    console.table(rows);
                    mainMenu();
                }
            });

        });
    });
}






const viewEmployeeDepartments = () => {

    connection.query('SELECT id, name FROM departments', function (error, rows) {

        const departments = rows.map(row => ({ value: row.id, name: row.name }));

        const departmentsMenu = [
            {
                type: 'list',
                name: 'department_id',
                message: "Choose a department:",
                choices: departments
            }
        ];

        inquirer.prompt(departmentsMenu).then((answers) => {

            var query = `select departments.name as "Department", roles.title AS "Role", CONCAT(employees.first_name, " ", employees.last_name) AS "Full Name",  roles.salary AS "Salary",  CONCAT(managers.first_name, " ", managers.last_name) AS "Manager" from employees join roles on employees.role_id = roles.id join departments on roles.department_id = departments.id join employees managers ON employees.manager_id = managers.id where departments.id = ? order by employees.last_name ASC`;

            connection.query(query, [answers.department_id], function (error, rows) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("\n");
                    console.table(rows);
                    mainMenu();
                }
            });

        });
    });
}

const viewEmployeeManagers = () => {

    connection.query('SELECT DISTINCT managers.id, CONCAT(managers.first_name, " ", managers.last_name) AS "full_name" FROM employees join employees managers ON employees.manager_id = managers.id;', function (error, rows) {

        const managers = rows.map(row => ({ value: row.id, name: `${row.full_name}` }));

        const managersMenu = [
            {
                type: 'list',
                name: 'manager_id',
                message: "Choose a manager:",
                choices: managers
            }
        ];

        inquirer.prompt(managersMenu).then((answers) => {

            var query = `SELECT CONCAT(managers.first_name, " ", managers.last_name) AS "Manager", departments.name AS "Department", roles.title AS "Role", CONCAT(employees.first_name, " ", employees.last_name) AS "Full Name",  roles.salary AS "Salary" FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id JOIN employees managers ON employees.manager_id = managers.id WHERE managers.id = ? ORDER BY employees.last_name ASC`;

            connection.query(query, [answers.manager_id], function (error, rows) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("\n");
                    console.table(rows);
                    mainMenu();
                }
            });

        });
    });
}

//Adding employee and selecting their role and manager
const addEmployee = () => {
    connection.query('SELECT id, title FROM roles', function (error, rows) {

        const roles = rows.map(row => ({ value: row.id, name: row.title }));

        connection.query('SELECT DISTINCT managers.id, CONCAT(managers.first_name, " ", managers.last_name) AS "full_name" FROM employees join employees managers ON employees.manager_id = managers.id;', function (error, rows) {

            const manager = rows.map(row => ({ value: row.id, name: `${row.full_name}` }));

            const newEmployeeMenu = [
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is the new employees first name?',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'What is the new employees last name?',

                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'What is their role?',
                    choices: roles
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'What is the name of their manager?',
                    choices: manager
                }
            ];


            inquirer.prompt(newEmployeeMenu).then((answers) => {

                var query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                connection.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], function (error, rows) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        viewEmployees();
                        
                    }
                });
            });
        });
    });
}

//Adding a new role
const addRole = () => {
    connection.query('SELECT id, name FROM departments', function (error, rows) {

        const departments = rows.map(row => ({ value: row.id, name: row.name }));

        
            const newRoleMenu = [
                {
                    name: 'title',
                    type: 'input',
                    message: 'What role would you like to add?',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for this role?',
                    
                },
                {
                    name: 'department_id',
                    type: 'list',
                    message: 'What department is that in?',
                    choices: departments

                },
           
            ];


            inquirer.prompt(newRoleMenu).then((answers) => {

                var query = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;

                connection.query(query, [answers.title, answers.salary, answers.department_id], function (error, rows) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        viewEmployees();
                        
                    }
                });
            });
        });
    
}



const addDepartment = () => {
            
    const newDepartmentMenu = [
        {
            name: 'name',
            type: 'input',
            message: 'What department would you like to add?',
        },
                         
    ];
    inquirer.prompt(newDepartmentMenu).then((answers) => {
        var query = `INSERT INTO departments (name) VALUES (?)`;

        connection.query(query, [answers.name], function (error, rows) {
            if (error) {
                console.log(error);
            }
            else {
                viewEmployees();
                     
            }
        });
    });
    
}


// updateRole()




// updateEmployee()

// updateDepartment()
// removeEmployee()
// removeRole()
// removeDepartment()