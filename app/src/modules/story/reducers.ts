import { StoryProgress, Scene } from "../../types/story";
import {
  StoryAction,
  TO_SCENE,
  INIT_STORY,
  INIT_STORY_SUCCESS,
  UPDATE_STORY,
  UPDATE_STORY_SUCCESS,
} from "./actions";
import { parseStoryGuideline } from "./utils";

// Initial State
export type StoryState = {
  storyProgressPrompts: StoryProgress[];
  title: string;
  introduction: string;
  currentSceneIndex: number;
  scenes: Scene[];
};
const initialState: StoryState = {
  currentSceneIndex: 0,
  storyProgressPrompts: [],
  title: "",
  introduction: "",
  scenes: [],
};

// Reducer
const storyReducer = (state = initialState, action: StoryAction) => {
  switch (action.type) {
    case TO_SCENE: {
      const { index } = action.data;
      return {
        ...state,
        currentSceneIndex: index,
      };
    }
    case INIT_STORY: {
      const { initMessage } = action.data;
      return {
        ...state,
        storyProgressPrompts: [...state.storyProgressPrompts, initMessage],
      };
    }
    case INIT_STORY_SUCCESS: {
      const { progress } = action.data;
      const { title, introduction, scene } = parseStoryGuideline(
        progress.content
      );
      return {
        ...state,
        title,
        introduction,
        scenes: [...state.scenes, scene],
        storyProgressPrompts: [...state.storyProgressPrompts, progress],
      };
    }
    case UPDATE_STORY: {
      // when users fires their prompt to open AI, add the user role prompt into prompt list
      const { message } = action.data;
      return {
        ...state,
        storyProgressPrompts: [...state.storyProgressPrompts, message],
      };
    }
    case UPDATE_STORY_SUCCESS: {
      // when user received resp from open AI, it includes assistant prompt
      const { progress } = action.data;
      const { scene } = parseStoryGuideline(progress.content);
      return {
        ...state,
        scenes: [...state.scenes, scene],
        storyProgressPrompts: [...state.storyProgressPrompts, progress],
      };
    }
    default:
      return state;
  }
};

export default storyReducer;
