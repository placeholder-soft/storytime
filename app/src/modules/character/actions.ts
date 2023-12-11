import { Action } from "redux";

// Action Types
export const CREATE_CHARACTER = "Character/CREATE_CHARACTER";
export const CREATE_CHARACTER_SUCCESS = "Character/CREATE_CHARACTER_SUCCESS";

// Action Creators
type CreateCharacterBody = { sketchBlob: Blob; prompt: string };
export type CreateCharacterAction = Action & { data: CreateCharacterBody };
export const createCharacter = (
  data: CreateCharacterBody
): CreateCharacterAction => ({
  type: CREATE_CHARACTER,
  data,
});

export type CreateCharacterSuccessAction = Action & {
  data: Blob;
};
export const createCharacterSuccess = (data: Blob) => ({
  type: CREATE_CHARACTER_SUCCESS,
  data,
});
