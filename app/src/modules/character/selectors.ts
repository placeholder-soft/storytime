import { createSelector } from "reselect";
import { RootState } from "..";

// Assuming your state structure has a counter object
const getCharacterBase = (state: RootState) => state.character;

// Use createSelector to create a memoized selector
export const characterImageSelector = createSelector(
  [getCharacterBase],
  ({ characterImage }) => characterImage
);
