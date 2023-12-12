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

type CreateCharacterSuccessBody = { blob: Blob; characterType: string };
export type CreateCharacterSuccessAction = Action & {
  data: CreateCharacterSuccessBody;
};
export const createCharacterSuccess = (data: CreateCharacterSuccessBody) => ({
  type: CREATE_CHARACTER_SUCCESS,
  data,
});
