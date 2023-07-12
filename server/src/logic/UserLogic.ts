import { User } from "../models/User";
import dal_mysql from "../utils/dal_mysql";

export const userRegister = async (user: User) => {
  const sql = `INSERT INTO vacation.users (firstName, lastName, email, password, level) 
  VALUES (
  '${user.firstName}', 
  '${user.lastName}', 
  '${user.email}', 
  '${user.password}', 
  '${user.level || 0}'
  )`;

  try {
    await dal_mysql.execute(sql);
  } catch (err) {
    return err;
  }
};

export const userLogin = async (email: User) => {
  const sql = `SELECT * FROM vacation.users WHERE email = '${email}'`;
  try {
    const result = await dal_mysql.execute(sql);
    return result[0];
  } catch (err) {
    return err;
  }
};

export const getUserByEmail = async (email: string) => {
  const sql = `SELECT * FROM vacation.users WHERE email = '${email}'`;
  try {
    const result = await dal_mysql.execute(sql);
    return result[0];
  } catch (err) {
    console.log(err);
  }
};
