const inquirer = require("inquirer");

function start(){
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?",
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

function viewAllEmployees(){
    const sql = 
    "SELECT emp.id AS EmployeeID, concat(emp.first_name, ' ', emp.last_name) AS EmployeeName, role.title AS RoleTitle, role.salary AS Salary, department.name AS DepartmentName, concat(manager.first_name, ' ', manager.last_name) AS ManagerName FROM employee AS emp " + 
    "LEFT JOIN employee_db.employee AS manager ON emp.manager_id=manager.id " +
    "LEFT JOIN role ON emp.role_id=role.id " +
    "LEFT JOIN department ON department.id=role.department_id ";

    connection.query(sql, (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    });
}

function viewAllRoles(){
    const sql = 
    "SELECT title as RoleTitle, salary as Salary, department.name as DepartmentName FROM role " +
    "LEFT JOIN department ON role.department_id=department.id";

    connection.query(sql, (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    });
}

function viewAllDepartments(){
    const sql = 
    "SELECT * FROM department";
    connection.query(sql, (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    });
}

function addEmployee(){
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
            message: "Who is the new employee's manager? Enter the manager's ID",
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the new employee's role? Enter the role ID",
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
            if(err) throw err;
            start();
        });
    })
}
