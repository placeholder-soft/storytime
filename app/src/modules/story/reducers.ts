import { StoryProgress, Scene } from "../../types/story";
import {
  StoryAction,
  TO_SCENE,
  INIT_STORY,
  INIT_STORY_SUCCESS,
  UPDATE_STORY,
  UPDATE_STORY_SUCCESS,
  LOAD_STORY,
} from "./actions";
import { parseStoryGuideline } from "./utils";
import { STORY_MOCK } from "../../mock";

// Initial State
export type StoryState = {
  storyProgressPrompts: StoryProgress[];
  title: string;
  introduction: string;
  coverImage: string;
  currentSceneIndex: number;
  scenes: Scene[];
};
const initialState: StoryState = {
  storyProgressPrompts: [],
  title: "",
  introduction: "",
  coverImage: "",
  currentSceneIndex: 0,
  scenes: [],
};

// const initialState: StoryState = STORY_MOCK;

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
      const { progress, coverImage, sceneImage } = action.data;
      const { title, introduction, scene } = parseStoryGuideline(
        progress.content,
      );
      return {
        ...state,
        title,
        introduction,
        coverImage,
        scenes: [...state.scenes, { ...scene, sceneImage }],
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
      const { progress, sceneImage } = action.data;
      const { scene } = parseStoryGuideline(progress.content);
      return {
        ...state,
        scenes: [...state.scenes, { ...scene, sceneImage }],
        storyProgressPrompts: [...state.storyProgressPrompts, progress],
      };
    }
    case LOAD_STORY: {
      // when users fires their prompt to open AI, add the user role prompt into prompt list
      const { storyProgressPrompts, title, introduction, coverImage, scenes } =
        action.data;
      return {
        ...state,
        storyProgressPrompts,
        title,
        introduction,
        coverImage,
        scenes,
      };
    }
    default:
      return state;
  }
};

export default storyReducer;
