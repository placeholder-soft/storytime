import {
  CREATE_CHARACTER_NAME,
  CREATE_CHARACTER_TYPE,
  CREATE_CHARACTER_IMAGE_SUCCESS,
  CharacterAction,
} from "./actions";

// Initial State
export type CharacterState = {
  characterName: string;
  characterType: string;
  customCharacterType: string;
  characterImage?: Blob;
};
const initialState: CharacterState = {
  characterName: "",
  characterType: "",
  customCharacterType: "",
  characterImage: undefined,
};

// Reducer
const characterReducer = (state = initialState, action: CharacterAction) => {
  switch (action.type) {
    case CREATE_CHARACTER_NAME: {
      const { characterName } = action.data;
      return { ...state, characterName };
    }
    case CREATE_CHARACTER_TYPE: {
      const { characterType, customCharacterType } = action.data;
      return { ...state, characterType, customCharacterType };
    }
    case CREATE_CHARACTER_IMAGE_SUCCESS: {
      const { blob, characterType } = action.data;
      return { ...state, characterImage: blob, characterType };
    }
    default:
      return state;
  }
};

export default characterReducer;
