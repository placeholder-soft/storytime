import axios from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { StoryProgress } from "../../types/story";
import {
  INIT_STORY,
  UPDATE_STORY,
  InitStoryAction,
  initStorySuccess,
  updateStorySuccess,
  toScene,
} from "./actions";
import { storyProgressSelector, storySelector } from "./selectors";

// Sample worker saga
function* initStory(action: InitStoryAction) {
  const { initMessage } = action.data;
  const payload = {
    model: "gpt-4-1106-preview",
    messages: [initMessage],
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
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

function* updateStory(action: InitStoryAction) {
  const { message } = action.data;
  const { currentSceneIndex } = yield select(storySelector);
  const storyProgress = (yield select(
    storyProgressSelector
  )) as StoryProgress[];
  const payload = {
    model: "gpt-4-1106-preview",
    messages: [...storyProgress, message],
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
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
    yield put(updateStorySuccess({ progress }));
  } catch (e) {
    console.error(e);
  } finally {
    yield put(toScene({ index: currentSceneIndex + 1 }));
  }
}

// Combine all sagas
export default function* storySaga() {
  yield takeEvery(INIT_STORY, initStory);
  yield takeEvery(UPDATE_STORY, updateStory);
}
