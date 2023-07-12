import { OkPacket } from "mysql";
import { Vacation } from "../models/Vacation";
import dal_mysql from "../utils/dal_mysql";

export const addVacation = async (newVacation: Vacation) => {
  const sql = `INSERT INTO vacation.vacations
      (destination, description, image, startDate, endDate, price) 
      VALUES (
          '${newVacation.destination}', 
          '${newVacation.description}', 
          '${newVacation.image}', 
          '${newVacation.startDate}', 
          '${newVacation.endDate}', 
           ${newVacation.price}
          )`;
  const result: OkPacket = await dal_mysql.execute(sql);
  return result;
};

export const updateVacation = async (id: number, updateCondition: any) => {
  const setCondition = Object.keys(updateCondition).reduce(
    (acc, key, index, arr) => {
      return (
        acc +
        `${key} = '${updateCondition[key]}'${index < arr.length - 1 ? "," : ""}`
      );
    },
    ""
  );

  const sql = `UPDATE vacation.vacations SET ${setCondition} WHERE id = ${id}`;

  await dal_mysql.execute(sql);
  return true;
};

export const getAllVacations = async () => {
  const sql = `SELECT * FROM vacation.vacations`;
  return await dal_mysql.execute(sql);
};

export const deleteVacation = async (id: number) => {
  const sql = `DELETE FROM vacation.vacations WHERE id = ${id}`;
  await dal_mysql.execute(sql);
  return true;
};

export const getVacationByDestination = async (destination: string) => {
  const sql = `SELECT * FROM vacation.vacations WHERE destination = '${destination}'`;
  const result = await dal_mysql.execute(sql);
  return result;
};

export const getVacationById = async (id: number) => {
  const sql = `SELECT * FROM vacation.vacations WHERE id = ${id}`;
  const result = await dal_mysql.execute(sql);
  return result;
};
