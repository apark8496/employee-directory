// required packages
const inquirer = require("inquirer");
const connection = require('./db/connection.js');
const logo = require("asciiart-logo");

// Functions to display the logo and start the application
logoArt();

// Function to start tracking.
// Prompts user to select an action and then executes the appropriate function for that action.
function start() {
    inquirer.prompt(
        {
            type: "list",
            message: "Welcome, what would you like to do?",
            name: "choice",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee Role",
                "Update Employee Manager",
                "View Employee By Manager",
                "Delete Employee",
                "Delete Role",
                "Delete Department",
                "See Utilized Budget",
                "Exit"
            ]

        }).then(answer => {

            // Switch case is used to execute the appropriate function based on the users selection
            switch (answer.choice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "View Employee By Manager":
                    viewEmployeeByManager();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                case "Delete Role":
                    deleteRole()
                    break;
                case "Delete Department":
                    deleteDepartment()
                    break;
                case "See Utilized Budget":
                    utilizedBudget()
                    break;
                case "Exit":
                    connection.end();
                    console.log("Have a good day");
                    break;
            }
        })
}

// A query which returns all data for all employees of the database
function viewAllEmployees() {
    const sql =
        "SELECT emp.id AS Employee_ID, concat(emp.first_name, ' ', emp.last_name) AS Employee, role.title AS Role, role.salary AS Salary, department.name AS Department, concat(manager.first_name, ' ', manager.last_name) AS Manager FROM employee AS emp " +
        "LEFT JOIN employee_db.employee AS manager ON emp.manager_id=manager.id " +
        "LEFT JOIN role ON emp.role_id=role.id " +
        "LEFT JOIN department ON department.id=role.department_id ";

    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// A query which returns all data for all roles of the database
function viewAllRoles() {
    const sql =
        "SELECT title as Role, salary as Salary, department.name as Department FROM role " +
        "LEFT JOIN department ON role.department_id=department.id";

    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// A query which returns all data for all departments of the database
function viewAllDepartments() {
    const sql =
        "SELECT * FROM department";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to create a new member
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the new employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the new employee's last name?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "Who is the new employee's manager? Enter the manager's ID.",
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the new employee's role? Enter their role ID.",
        },
    ])
        .then(answers => {

            connection.query("INSERT INTO employee SET ? ",
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    manager_id: answers.manager_id,
                    role_id: answers.role_id
                }, (err, res) => {
                    if (err) throw err;
                    start();
                });
        })
}

// Function to create a new role
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the new role's salary?"
        },
        {
            type: "input",
            name: "department_id",
            message: "What is the new role's department? Enter the department's ID.",
        }
    ])
        .then(answers => {

            connection.query("INSERT INTO role SET ? ",
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.department_id
                }, (err, res) => {
                    if (err) throw err;
                    start();
                });
        })


}

// Function to create a new department
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the new department?"
        }
    ])
        .then(answers => {

            connection.query("INSERT INTO department SET ? ",
                {
                    name: answers.name
                }, (err, res) => {
                    if (err) throw err;
                    start();
                });
        })


}

// Update Employee Role
function updateEmployeeRole(){
    connection.query("SELECT employee.id, first_name, last_name, title, role_id FROM employee JOIN role ON role_id=role.id", (err,res) => {
        if(err) throw err;

        var employeeList = [];
        res.forEach(employee => {employeeList.push(employee.id + ": " + employee.first_name + " " + employee.last_name)});

        var roleChoices = [];
        res.forEach(role => {roleChoices.push(role.role_id + ": " + role.title)});

        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to change roles?",
                choices: employeeList
            },
            {
                type: "list",
                name: "role",
                message: "Which role would you like to change the employee to?",
                choices: roleChoices
            }

        ])
        .then(answers => {


            connection.query("UPDATE employee SET ? WHERE ?",
            [ 
                {
                    role_id: answers.role[0],
                },
                {
                    id: answers.employee[0],
                }
            ],
            (err,res) => {
                if (err) throw err;
                start();
            });
        })
    })
}

// function to update employee's manager
function updateEmployeeManager() {
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, res) => {
        if (err) throw err;

        var employeeList = [];
        res.forEach(employee => { employeeList.push(employee.id + ": " + employee.first_name + " " + employee.last_name) });

        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to change the manager for?",
                choices: employeeList
            },
            {
                type: "list",
                name: "manager",
                message: "Which manager would you like to change the employee to?",
                choices: employeeList
            }

        ])
            .then(answers => {


                connection.query("UPDATE employee SET ? WHERE ?",
                    [
                        {
                            manager_id: answers.manager[0],
                        },
                        {
                            id: answers.employee[0],
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;
                        start();
                    });
            })
    })
}

// view employee by manager
function viewEmployeeByManager() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;

        var managerList = [];
        res.forEach(employee => { managerList.push(employee.id + ": " + employee.first_name + " " + employee.last_name) });

        inquirer.prompt([
            {
                type: "list",
                name: "manager",
                message: "Which manager's employees would you like to review?",
                choices: managerList
            }
        ])
            .then(answers => {
                connection.query("SELECT * FROM employee WHERE ?",

                    {
                        manager_id: parseInt(answers.manager[0])
                    }
                    ,
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        start();
                    });
            })
    })
}

// delete employee
function deleteEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;

        var employeeList = [];
        res.forEach(employee => { employeeList.push(employee.id + ": " + employee.first_name + " " + employee.last_name) });

        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to remove?",
                choices: employeeList
            }
        ])
            .then(answers => {
                connection.query("DELETE FROM employee WHERE ?",
                    [
                        {
                            id: answers.employee[0],
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;
                        start();
                    });
            })
    })
}

// delete role
function deleteRole() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;

        var roleList = [];
        res.forEach(role => { roleList.push(role.id + ": " + role.title) });

        inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Which employee would you like to remove?",
                choices: roleList
            }
        ])
            .then(answers => {
                connection.query("DELETE FROM role WHERE ?",
                    [
                        {
                            id: answers.role[0],
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;
                        start();
                    });
            })
    })
}

// delete department
function deleteDepartment() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        var departmentList = [];
        res.forEach(department => { departmentList.push(department.id + ": " + department.name) });

        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which employee would you like to remove?",
                choices: departmentList
            }
        ])
            .then(answers => {
                connection.query("DELETE FROM department WHERE ?",
                    [
                        {
                            id: answers.department[0],
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;
                        start();
                    });
            })
    })
}

function utilizedBudget() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        var departmentList = [];
        res.forEach(department => { departmentList.push(department.id + ": " + department.name) });

        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department would you like to the utilized budget of?",
                choices: departmentList
            }
        ])
            .then(answers => {
                connection.query("SELECT salary FROM employee JOIN role ON role_id=role.id WHERE ?",
                    [
                        {
                            department_id: answers.department[0],
                        }
                    ],
                    (err, res) => {
                        let totalSalary = 0;
                        res.forEach(salary => totalSalary += salary.salary)
                        console.log("The total utilized budget for the request department is : " + totalSalary);
                        if (err) throw err;
                        start();
                    });
            })
    })
}


connection.connect((err) => {
    if (err) throw err;
    start();
});

//  Function to create opening logo
function logoArt() {
    console.log(
        logo({
            name: "Employee Directory",
            font: "Standard",
            lineChars: 20,
            padding: 5,
            margin: 5,
            borderColor: "grey",
            logoColor: "bold-blue",
            textColor: "grey",
        })
            .render()
    );
}