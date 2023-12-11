import { createSelector } from "reselect";
import { RootState } from "..";

// Assuming your state structure has a counter object
const getStoryBase = (state: RootState) => state.story;

export const storyProgressSelector = createSelector(
  [getStoryBase],
  ({ storyProgressPrompts }) => storyProgressPrompts
);
