import axios from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  CREATE_CHARACTER_IMAGE,
  CreateCharacterImageAction,
  createCharacterImageSuccess,
} from "./actions";

// Sample worker saga
function* createCharacterImage(action: CreateCharacterImageAction) {
  const { sketchBlob, prompt } = action.data;
  const formData = new FormData();
  formData.append("sketch_file", sketchBlob);
  formData.append("prompt", prompt);

  try {
    const { data } = yield call(
      axios.post,
      "https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image",
      formData,
      {
        headers: {
          "x-api-key": import.meta.env.VITE_CLIPDROP_SECRET,
        },
        responseType: "blob",
      }
    );
    yield put(
      createCharacterImageSuccess({ blob: data, characterType: prompt })
    );
  } catch (e) {
    console.error(e);
  }
}

// Combine all sagas
export default function* characterSaga() {
  yield takeEvery(CREATE_CHARACTER_IMAGE, createCharacterImage);
}
