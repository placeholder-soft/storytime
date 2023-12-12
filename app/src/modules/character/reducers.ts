import {
  CreateCharacterSuccessAction,
  CREATE_CHARACTER_SUCCESS,
} from "./actions";

// Initial State
export type CharacterState = {
  characterName: string;
  characterType: string;
  characterImage: Blob;
};
const initialState: CharacterState = {
  characterName: "Gary", // TODO: update from start UI
  characterType: "",
  characterImage: new Blob(),
};

// Reducer
const characterReducer = (
  state = initialState,
  action: CreateCharacterSuccessAction
) => {
  switch (action.type) {
    case CREATE_CHARACTER_SUCCESS: {
      const { blob, characterType } = action.data;
      return { ...state, characterImage: blob, characterType };
    }
    default:
      return state;
  }
};

export default characterReducer;
