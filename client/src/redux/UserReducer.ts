import { User } from "../models/User";

export interface UserState {
  user: User | null;
  token: string | null;
}

export enum UserActionType {
  setLogout = "setLogout",
  setLogin = "setLogin",
}

export interface UserAction {
  type: UserActionType;
  payload?: any;
}

export const setLogoutAction = (): UserAction => {
  return { type: UserActionType.setLogout };
};

export const setLoginAction = (user: User, token: string): UserAction => {
  return { type: UserActionType.setLogin, payload: { user, token } };
};

export const userReducer = (
  currentState: UserState = {
    user: null,
    token: null,
  },
  action: UserAction
): UserState => {
  const newState = { ...currentState };

  switch (action.type) {
    case UserActionType.setLogout:
      newState.user = null;
      newState.token = null;
      break;

    case UserActionType.setLogin:
      newState.user = action.payload.user;
      newState.token = action.payload.token;
      break;

    default:
      return currentState;
  }

  return newState;
};
