import { Follow } from "../models/Follow";

export interface FollowState {
  follows: Follow[];
}

export enum FollowActionType {
  setFollow = "setFollow",
  removeFollow = "removeFollow",
  allFollowers = "allFollowers",
  removeAllFollowers = "removeAllFollowers",
  getFollowersByUser = "getFollowersByUser",
}

export interface FollowAction {
  type: FollowActionType;
  payload?: any;
}

export const allFollowersAction = (followers: Follow): FollowAction => {
  return { type: FollowActionType.allFollowers, payload: followers };
};

export const removeAllFollowersAction = (followers: Follow): FollowAction => {
  return { type: FollowActionType.removeAllFollowers, payload: followers };
};

export const setFollowAction = (follow: Follow): FollowAction => {
  return { type: FollowActionType.setFollow, payload: follow };
};

export const removeFollowAction = (follow: Follow): FollowAction => {
  return { type: FollowActionType.removeFollow, payload: follow };
};

export const getFollowersByUserAction = (userId: number): FollowAction => {
  return { type: FollowActionType.getFollowersByUser, payload: userId };
};

export const followReducer = (
  currentState: FollowState = { follows: [] },
  action: FollowAction
): FollowState => {
  const state = { ...currentState };

  switch (action.type) {
    case FollowActionType.setFollow:
      state.follows = [...state.follows, action.payload];
      break;
    case FollowActionType.removeFollow:
      state.follows = state.follows.filter(
        (f) =>
          f.vacationId !== action.payload.vacationId ||
          f.userId !== action.payload.userId
      );
      break;
    case FollowActionType.allFollowers:
      state.follows = action.payload;
      break;
    case FollowActionType.removeAllFollowers:
      state.follows = state.follows.filter(
        (f) => f.vacationId !== action.payload
      );
      break;
    default:
      return currentState;
  }
  return state;
};
