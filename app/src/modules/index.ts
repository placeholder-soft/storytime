import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import characterReducer, { CharacterState } from "./character/reducers";
import characterSaga from "./character/sagas";

export type RootState = {
  character: CharacterState;
};

export const rootReducer = combineReducers({
  character: characterReducer,
});

function* rootSaga() {
  yield all([characterSaga()]);
}

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (gdm) => gdm().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
