const {Pool} = require(`pg`);

const db = new Pool({
  user: `postgres`,
  password: `root`,
  host: `localhost`,
  database: `employees_db`
});

module.exports = db;
