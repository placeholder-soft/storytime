import axios from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import { StoryProgress } from "../../types/story";
import { INIT_STORY, InitStoryAction, initStorySuccess } from "./actions";

// Sample worker saga
function* initStory(action: InitStoryAction) {
  const { initMessage } = action.data;
  const payload = {
    model: "gpt-4-1106-preview",
    messages: [initMessage],
  };

  try {
    const { data } = yield call(
      axios.post,
      "https://api.openai.com/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_SECRET}`,
        },
      }
    );
    const progress = data.choices?.[0].message as StoryProgress;
    yield put(initStorySuccess({ progress }));
  } catch (e) {
    console.error(e);
  }
}

// Combine all sagas
export default function* storySaga() {
  yield takeEvery(INIT_STORY, initStory);
}
