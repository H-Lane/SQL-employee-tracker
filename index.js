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
              `INSERT INTO department VALUES (?)`,
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
                  for (let i = 0; i < data.length; i++) {
                    choicesArray.push(data[i].name);
                  }
                  return choicesArray;
                },
              },
            ])
            .then((response) => {
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === response.department) {
                  const department = data[i];
                }
              }

              db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [response.role, response.salary, department.id],
                (err, data) => {
                  if (err) throw err;
                  console.log(`Added ${answers.role} to roles.`);
                  init();
                }
              );
            });
        });
      }
    });
}
