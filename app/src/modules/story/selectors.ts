import { Scene } from "model";
import { createSelector } from "reselect";
import { RootState } from "..";

// Assuming your state structure has a counter object
const getStoryBase = (state: RootState) => state.story;

export const storyBaseSelector = createSelector(
  [getStoryBase],
  (story) => story,
);

export const storySelector = createSelector(
  [getStoryBase],
  ({ title, introduction, coverImage, currentSceneIndex }) => ({
    title,
    introduction,
    coverImage,
    currentSceneIndex,
  }),
);

export const currentSceneSelector = createSelector(
  [getStoryBase],
  ({ scenes, currentSceneIndex }) =>
    currentSceneIndex > 0 ? scenes[currentSceneIndex - 1] : ({} as Scene),
);

export const storyProgressSelector = createSelector(
  [getStoryBase],
  ({ storyProgressPrompts }) => storyProgressPrompts,
);
