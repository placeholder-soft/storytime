import { Action } from "redux";
import { StoryProgress } from "../../types/story";

// Action Types
export const TO_SCENE = "Story/TO_SCENE";
export const INIT_STORY = "Story/INIT_STORY";
export const INIT_STORY_SUCCESS = "Story/INIT_STORY_SUCCESS";
export const UPDATE_STORY = "Story/UPDATE_STORY";
export const UPDATE_STORY_SUCCESS = "Story/UPDATE_STORY_SUCCESS";

// Action Creators
type ToSceneBody = { index: number };
export type ToSceneAction = Action & { data: ToSceneBody };
export const toScene = (data: ToSceneBody): ToSceneAction => ({
  type: TO_SCENE,
  data,
});

type InitStoryBody = { initMessage: StoryProgress };
export type InitStoryAction = Action & { data: InitStoryBody };
export const initStory = (data: InitStoryBody): InitStoryAction => ({
  type: INIT_STORY,
  data,
});

type InitStorySuccessBody = {
  progress: StoryProgress;
  coverImage: string;
  sceneImage: string; // note: for scene1
};
export type InitStorySuccessAction = Action & {
  data: InitStorySuccessBody;
};
export const initStorySuccess = (data: InitStorySuccessBody) => ({
  type: INIT_STORY_SUCCESS,
  data,
});

type UpdateStoryBody = { message: StoryProgress };
export type UpdateStoryAction = Action & { data: UpdateStoryBody };
export const updateStory = (data: UpdateStoryBody): UpdateStoryAction => ({
  type: UPDATE_STORY,
  data,
});

type UpdateStorySuccessBody = { progress: StoryProgress; sceneImage: string };
export type UpdateStorySuccessAction = Action & {
  data: UpdateStorySuccessBody;
};
export const updateStorySuccess = (data: UpdateStorySuccessBody) => ({
  type: UPDATE_STORY_SUCCESS,
  data,
});

export type StoryAction =
  | ToSceneAction
  | InitStoryAction
  | InitStorySuccessAction
  | UpdateStoryAction
  | UpdateStorySuccessAction;
