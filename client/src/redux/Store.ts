import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { userReducer } from "./UserReducer";
import storage from "redux-persist/lib/storage";
import { vacationReducer } from "./VacationReducer";
import { followReducer } from "./FollowReducer";

const userPersistConfig = {
  key: "users",
  storage,
};

const vacationPersistConfig = {
  key: "vacations",
  storage,
};

const followPersistConfig = {
  key: "follows",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const persistedVacationReducer = persistReducer(
  vacationPersistConfig,
  vacationReducer
);

const persistedFollowReducer = persistReducer(
  followPersistConfig,
  followReducer
);

const rootReducer = {
  users: persistedUserReducer,
  vacations: persistedVacationReducer,
  follows: persistedFollowReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
