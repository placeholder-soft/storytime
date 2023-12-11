import { StoryProgress, Scene } from "../../types/story";
import {
  StoryAction,
  INIT_STORY,
  INIT_STORY_SUCCESS,
  UPDATE_STORY,
  UPDATE_STORY_SUCCESS,
} from "./actions";
import { parseStoryGuideline } from "./utils";

// Initial State
export type StoryState = {
  storyProgressPrompts: StoryProgress[];
  storyTitle: string;
  storyIntro: string;
  scene: number;
  scenes: Scene[];
};
const initialState: StoryState = {
  scene: 0,
  storyProgressPrompts: [],
  storyTitle: "",
  storyIntro: "",
  scenes: [],
};

// Reducer
const storyReducer = (state = initialState, action: StoryAction) => {
  switch (action.type) {
    case INIT_STORY: {
      const { initMessage } = action.data;
      return {
        ...state,
        storyProgressPrompts: [...state.storyProgressPrompts, initMessage],
      };
    }
    case INIT_STORY_SUCCESS: {
      const { progress } = action.data;
      const { title, intro, scene } = parseStoryGuideline(progress.content);
      return {
        ...state,
        storyTitle: title,
        storyIntro: intro,
        storyProgressPrompts: [...state.storyProgressPrompts, progress],
        scenes: [...state.scenes, scene],
      };
    }
    case UPDATE_STORY: {
      // TODO: when users fires their prompt to open AI, add the user role prompt into prompt list
      return state;
    }
    case UPDATE_STORY_SUCCESS: {
      // TODO: when user received resp from open AI, it includes assistant prompt
      return state;
    }
    default:
      return state;
  }
};

export default storyReducer;
