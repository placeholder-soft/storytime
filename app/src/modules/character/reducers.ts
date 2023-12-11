import {
  CreateCharacterSuccessAction,
  CREATE_CHARACTER_SUCCESS,
} from "./actions";

// Initial State
export type CharacterState = {
  characterName: string;
  characterImage: Blob;
};
const initialState: CharacterState = {
  characterName: "",
  characterImage: new Blob(),
};

// Reducer
const characterReducer = (
  state = initialState,
  action: CreateCharacterSuccessAction
) => {
  switch (action.type) {
    case CREATE_CHARACTER_SUCCESS: {
      const { blob, characterName } = action.data;
      return { ...state, characterImage: blob, characterName };
    }
    default:
      return state;
  }
};

export default characterReducer;
