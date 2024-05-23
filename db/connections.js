const { Post } = require(`pg`);

const db = new Post({
    user: `postgres`,
    password: `root`,
    host: `localhost`,
    database: `employees_db`
})