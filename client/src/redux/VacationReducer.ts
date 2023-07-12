import { Vacation } from "../models/Vacation";

export interface VacationState {
  vacations: Vacation[];
}

export enum VacationActionType {
  getAllVacations = "getAllVacations",
  addVacation = "addVacation",
  updateVacation = "updateVacation",
  deleteVacation = "deleteVacation",
}

export interface VacationAction {
  type: VacationActionType;
  payload?: any;
}

export const getAllVacationsAction = (
  vacations: Vacation[]
): VacationAction => {
  return { type: VacationActionType.getAllVacations, payload: vacations };
};

export const addVacationAction = (vacation: Vacation): VacationAction => {
  return { type: VacationActionType.addVacation, payload: vacation };
};

export const updateVacationAction = (vacation: Vacation): VacationAction => {
  return { type: VacationActionType.updateVacation, payload: vacation };
};

export const deleteVacationAction = (id: number): VacationAction => {
  return { type: VacationActionType.deleteVacation, payload: id };
};

export const vacationReducer = (
  currentState: VacationState = { vacations: [] },
  action: VacationAction
): VacationState => {
  const state = { ...currentState };

  switch (action.type) {
    case VacationActionType.getAllVacations:
      state.vacations = action.payload;
      break;
    case VacationActionType.addVacation:
      state.vacations = [...state.vacations, action.payload];
      break;
    case VacationActionType.updateVacation:
      state.vacations = state.vacations.filter((v) => v.id !== action.payload);
      break;
    case VacationActionType.deleteVacation:
      state.vacations = state.vacations.filter((v) => v.id !== action.payload);
      break;
  }
  return state;
};
