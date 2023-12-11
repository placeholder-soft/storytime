import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import characterReducer, { CharacterState } from "./character/reducers";
import characterSaga from "./character/sagas";
import storyReducer, { StoryState } from "./story/reducers";
import storySaga from "./story/sagas";

export type RootState = {
  character: CharacterState;
  story: StoryState;
};

export const rootReducer = combineReducers({
  character: characterReducer,
  story: storyReducer,
});

function* rootSaga() {
  yield all([characterSaga(), storySaga()]);
}

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (gdm) => gdm().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
