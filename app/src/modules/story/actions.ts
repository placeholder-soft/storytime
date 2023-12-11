import { Action } from "redux";
import { StoryProgress } from "../../types/story";

// Action Types
export const INIT_STORY = "Story/INIT_STORY";
export const INIT_STORY_SUCCESS = "Story/INIT_STORY_SUCCESS";
export const UPDATE_STORY = "Story/UPDATE_STORY";
export const UPDATE_STORY_SUCCESS = "Story/UPDATE_STORY_SUCCESS";

// Action Creators
type InitStoryBody = { initMessage: StoryProgress };
export type InitStoryAction = Action & { data: InitStoryBody };
export const initStory = (data: InitStoryBody): InitStoryAction => ({
  type: INIT_STORY,
  data,
});

type InitStorySuccessBody = { progress: StoryProgress };
export type InitStorySuccessAction = Action & {
  data: InitStorySuccessBody;
};
export const initStorySuccess = (data: InitStorySuccessBody) => ({
  type: INIT_STORY_SUCCESS,
  data,
});

type UpdateStoryBody = { initMessage: StoryProgress };
export type UpdateStoryAction = Action & { data: UpdateStoryBody };
export const UpdateStory = (data: UpdateStoryBody): UpdateStoryAction => ({
  type: INIT_STORY,
  data,
});

type UpdateStorySuccessBody = { progress: StoryProgress };
export type UpdateStorySuccessAction = Action & {
  data: UpdateStorySuccessBody;
};
export const updateStorySuccess = (data: InitStorySuccessBody) => ({
  type: UPDATE_STORY_SUCCESS,
  data,
});

export type StoryAction =
  | InitStoryAction
  | InitStorySuccessAction
  | UpdateStoryAction
  | UpdateStorySuccessAction;
