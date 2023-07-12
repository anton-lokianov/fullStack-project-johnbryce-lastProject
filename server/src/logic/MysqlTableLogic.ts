import dal_mysql from "../utils/dal_mysql";

const createFollowsTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS vacation.follows
      (
      userId INT NOT NULL,
      vacationId INT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (vacationId) REFERENCES vacations(id)
      );`;

  dal_mysql.execute(sql);
};

const createUsersTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS vacation.users
      (id INT NOT NULL AUTO_INCREMENT,
      firstName VARCHAR(45) NOT NULL,
      lastName VARCHAR(45) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      level INT NOT NULL,
      PRIMARY KEY(id));`;
  dal_mysql.execute(sql);
};

const createVacationsTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS vacation.vacations
      (id INT NOT NULL AUTO_INCREMENT,
      destination VARCHAR(45) NOT NULL,
      description VARCHAR(1000) NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      price INT NOT NULL,
      image VARCHAR(1000) NOT NULL,
      PRIMARY KEY(id));`;
  dal_mysql.execute(sql);
};

export default {
  createFollowsTable,
  createUsersTable,
  createVacationsTable,
};
