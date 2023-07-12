import {
  allFollowersAction,
  removeAllFollowersAction,
  removeFollowAction,
  setFollowAction,
} from "../redux/FollowReducer";
import { store } from "../redux/Store";
import { api } from "../utils/dbURL_key";

export const FollowVacation = () => {
  const addFollow = async (userId: number, vacationId: number) => {
    try {
      if (!vacationId || !userId) return;
      const response = await api.post(`/follows/${userId},${vacationId}`);
      if (response.status === 200) {
        store.dispatch(setFollowAction({ userId, vacationId }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeFollow = async (userId: number, vacationId: number) => {
    try {
      if (!vacationId || !userId) return;
      const response = await api.delete(`/follows/${userId},${vacationId}`);
      if (response.status === 200) {
        store.dispatch(removeFollowAction({ userId, vacationId }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllFollowers = async () => {
    try {
      const res = await api.get("/follows/");
      if (res.status === 200) {
        store.dispatch(allFollowersAction(res.data));
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeAllVacationFollowers = async (
    vacationId: number
  ): Promise<void> => {
    try {
      const res = await api.delete(`/follows/removeAll/${vacationId}`);
      if (res.status === 200) {
        store.dispatch(removeAllFollowersAction(res.data));
      } else {
        throw new Error("Failed to remove all vacation followers");
      }
    } catch (err: any) {
      console.log(err.response.data);
      throw new Error("Failed to remove all vacation followers");
    }
  };

  return {
    addFollow,
    removeFollow,
    getAllFollowers,
    removeAllVacationFollowers,
  };
};
