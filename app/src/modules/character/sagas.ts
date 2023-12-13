import axios from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  CREATE_CHARACTER_IMAGE,
  CreateCharacterImageAction,
  createCharacterImageSuccess,
} from "./actions";

const addPrefix = (val: string) => {
  return `A ${val} character. The character style should be plump character, cute style, character sheet, illustration for book, children's book, watercolor clipart, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, watercolor style, strybk, children's style fairy tales, chibi kawaii, . Octane rendering, 3d, perfect face, detailed face, delicate face, perfect sharp lips, detailed eyes. Craig Davison, Aubrey Beardsley, Conrad Roset, Aikut Aidogdu, Agnes Cecil, watercolor style.`;
};

// Sample worker saga
function* createCharacterImage(action: CreateCharacterImageAction) {
  const { sketchBlob, prompt } = action.data;
  const formData = new FormData();
  formData.append("sketch_file", sketchBlob);
  formData.append("prompt", addPrefix(prompt));

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
      },
    );
    yield put(createCharacterImageSuccess({ blob: data }));
  } catch (e) {
    console.error(e);
  }
}

// Combine all sagas
export default function* characterSaga() {
  yield takeEvery(CREATE_CHARACTER_IMAGE, createCharacterImage);
}
