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
  characterImage: Blob;
};
const initialState: CharacterState = {
  characterName: "",
  characterType: "",
  characterImage: new Blob(),
};

// Reducer
const characterReducer = (state = initialState, action: CharacterAction) => {
  switch (action.type) {
    case CREATE_CHARACTER_NAME: {
      const { characterName } = action.data;
      return { ...state, characterName };
    }
    case CREATE_CHARACTER_TYPE: {
      const { characterType } = action.data;
      return { ...state, characterType };
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
