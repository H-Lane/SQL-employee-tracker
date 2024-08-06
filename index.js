const inquirer = require(`inquirer`);
const db = require(`./db/connections`);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to Database");
  init();
});

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Change Employee Role",
          "Exit",
        ],
      },
    ])
    .then((response) => {
      if (response.prompt === "View All Departments") {
        db.query(`SELECT * FROM department`, (err, data) => {
          if (err) throw err;
          console.log(`Departments: `);
          console.table(data);
          init();
        });
      } else if (response.prompt === "View All Roles") {
        db.query(`SELECT * FROM role`, (err, data) => {
          if (err) throw err;
          console.log(`Roles: `);
          console.table(data);
          init();
        });
      } else if (response.prompt === "View All Employees") {
        db.query(`SELECT * FROM employee`, (err, data) => {
          if (err) throw err;
          console.log(`Employees: `);
          console.table(data);
          init();
        });
      } else if (response.prompt === "Add A Department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department",
              message: "Name of new Department:",
              validate: (input) => {
                if (input) {
                  return true;
                } else {
                  console.log("Department Name Required");
                  return false;
                }
              },
            },
          ])
          .then((response) => {
            db.query(
              "INSERT INTO department (name) VALUES (?)",
              [response.department],
              (err, data) => {
                if (err) throw err;
                console.log(`${response.department} added to Departments.`);
                init();
              }
            );
          });
      } else if (response.prompt === "Add A Role") {
        db.query(`SELECT * FROM department`, (err, data) => {
          if (err) throw err;
          console.log(`here is some`, data);
          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "Name of new Role:",
                validate: (input) => {
                  if (input) {
                    return true;
                  } else {
                    console.log("Please Add A Role!");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "salary",
                message: "Salary of new Role:",
                validate: (salaryInput) => {
                  if (salaryInput) {
                    return true;
                  } else {
                    console.log("Please Add A Salary!");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: () => {
                  let choicesArray = [];
                  for (let i = 0; i < data.rows.length; i++) {
                    choicesArray.push(data.rows[i].name);
                  }
                  return choicesArray;
                },
              },
            ])
            .then((response) => {
              for (let i = 0; i < data.rows.length; i++) {
                if (data.rows[i].name === response.department) {
                  var department = data.rows[i];
                }
              }

              db.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                [response.role, response.salary, department.id],
                (err, data) => {
                  if (err) throw err;
                  console.log(`Added ${response.role} to roles.`);
                  init();
                }
              );
            });
        });
      } else if (response.prompt === "Add An Employee") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "Employee's first name:",
                validate: (firstNameInput) => {
                  if (firstNameInput) {
                    return true;
                  } else {
                    console.log("Please Add A First Name!");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?",
                validate: (lastNameInput) => {
                  if (lastNameInput) {
                    return true;
                  } else {
                    console.log("Please Add A Salary!");
                    return false;
                  }
                },
              },
              {
                // Adding Employee Role
                type: "list",
                name: "role",
                message: "What is the employees role?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
              {
                // Adding Employee Manager
                type: "input",
                name: "manager",
                message: "Who is the employees manager?",
                validate: (managerInput) => {
                  if (managerInput) {
                    return true;
                  } else {
                    console.log("Please Add A Manager!");
                    return false;
                  }
                },
              },
            ])
            .then((response) => {
              for (let i = 0; i < result.length; i++) {
                if (result[i].title === response.role) {
                  let role = result[i];
                }
              }

              db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                [
                  response.firstName,
                  response.lastName,
                  role.id,
                  response.manager.id,
                ],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Added ${response.firstName} ${response.lastName} to the database.`
                  );
                  init();
                }
              );
            });
        });
      } else if (response.prompt === "Change Employee Role") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Which employees role do you want to update?",
                choices: () => {
                  let array = [];
                  for (let i = 0; i < result.length; i++) {
                    array.push(result[i].last_name);
                  }
                  let employeeArray = [...new Set(array)];
                  return employeeArray;
                },
              },
              {
                type: "list",
                name: "role",
                message: "What is their new role?",
                choices: () => {
                  let array = [];
                  for (let i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  let newArray = [...new Set(array)];
                  return newArray;
                },
              },
            ])
            .then((response) => {
              for (let i = 0; i < result.length; i++) {
                if (result[i].last_name === response.employee) {
                  var name = result[i];
                }
              }

              for (let i = 0; i < result.length; i++) {
                if (result[i].title === response.role) {
                  var role = result[i];
                }
              }

              db.query(
                `UPDATE employee SET ? WHERE ?`,
                [{ role_id: role }, { last_name: name }],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Changed ${response.employee}'s role in the database`
                  );
                  init();
                }
              );
            });
        });
      } else if (response.prompt === "Exit") {
        db.end();
        console.log("Good-Bye!");
      }
    });
}
