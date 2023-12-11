import {
  CreateCharacterSuccessAction,
  CREATE_CHARACTER_SUCCESS,
} from "./actions";

// Initial State
export type CharacterState = {
  characterImage: Blob;
};
const initialState: CharacterState = {
  characterImage: new Blob(),
};

// Reducer
const characterReducer = (
  state = initialState,
  action: CreateCharacterSuccessAction
) => {
  switch (action.type) {
    case CREATE_CHARACTER_SUCCESS:
      return { ...state, characterImage: action.data };
    default:
      return state;
  }
};

export default characterReducer;
