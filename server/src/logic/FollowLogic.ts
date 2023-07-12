import dal_mysql from "../utils/dal_mysql";

export const addFollower = async (userId: number, vacationId: number) => {
  const sql = `
    INSERT INTO vacation.follows
    (userId, vacationId)
    VALUES ('${userId}', '${vacationId}')`;
  return await dal_mysql.execute(sql);
};

export const removeFollower = async (userId: number, vacationId: number) => {
  const sql = `DELETE FROM vacation.follows WHERE userId=${userId} AND vacationId=${vacationId} `;
  return await dal_mysql.execute(sql);
};

export const removeAllFollowers = async (vacationId: number) => {
  const sql = `DELETE FROM vacation.follows WHERE vacationId=${vacationId} `;
  return await dal_mysql.execute(sql);
};

export const getAllFollowers = async (): Promise<[]> => {
  const sql = `SELECT * FROM vacation.follows`;
  return await dal_mysql.execute(sql);
};
