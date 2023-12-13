import { createSelector } from "reselect";
import { RootState } from "..";

// Assuming your state structure has a counter object
const getCharacterBase = (state: RootState) => state.character;

export const characterBaseSelector = createSelector(
  [getCharacterBase],
  (character) => character,
);

export const characterImageDrawingSelector = createSelector(
  [getCharacterBase],
  ({ drawing }) => drawing,
);

export const characterImageSelector = createSelector(
  [getCharacterBase],
  ({ characterImage }) => characterImage,
);

export const characterNameSelector = createSelector(
  [getCharacterBase],
  ({ characterName }) => characterName,
);

export const characterTypeSelector = createSelector(
  [getCharacterBase],
  ({ characterType }) => characterType,
);

export const customCharacterTypeSelector = createSelector(
  [getCharacterBase],
  ({ customCharacterType }) => customCharacterType,
);
