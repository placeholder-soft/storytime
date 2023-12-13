import { Action } from "redux";

// Action Types
export const CREATE_CHARACTER_NAME = "Character/CREATE_CHARACTER_NAME";
export const CREATE_CHARACTER_TYPE = "Character/CREATE_CHARACTER_TYPE";
export const CREATE_CHARACTER_IMAGE = "Character/CREATE_CHARACTER_IMAGE";
export const CREATE_CHARACTER_IMAGE_SUCCESS =
  "Character/CREATE_CHARACTER_IMAGE_SUCCESS";

// Action Creators
type CreateCharacterNameBody = { characterName: string };
export type CreateCharacterNameAction = Action & {
  data: CreateCharacterNameBody;
};
export const createCharacterName = (
  data: CreateCharacterNameBody,
): CreateCharacterNameAction => ({
  type: CREATE_CHARACTER_NAME,
  data,
});

type CreateCharacterTypeBody = {
  characterType: string;
  customCharacterType?: string;
};
export type CreateCharacterTypeAction = Action & {
  data: CreateCharacterTypeBody;
};
export const createCharacterType = (
  data: CreateCharacterTypeBody,
): CreateCharacterTypeAction => ({
  type: CREATE_CHARACTER_TYPE,
  data,
});

type CreateCharacterImageBody = { sketchBlob: Blob; prompt: string };
export type CreateCharacterImageAction = Action & {
  data: CreateCharacterImageBody;
};
export const createCharacterImage = (
  data: CreateCharacterImageBody,
): CreateCharacterImageAction => ({
  type: CREATE_CHARACTER_IMAGE,
  data,
});

type CreateCharacterImageSuccessBody = { blob: Blob };
export type CreateCharacterImageSuccessAction = Action & {
  data: CreateCharacterImageSuccessBody;
};
export const createCharacterImageSuccess = (
  data: CreateCharacterImageSuccessBody,
) => ({
  type: CREATE_CHARACTER_IMAGE_SUCCESS,
  data,
});

export type CharacterAction =
  | CreateCharacterImageAction
  | CreateCharacterImageSuccessAction;
