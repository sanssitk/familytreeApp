// intital data

export const initialState = {
  user: null,
  uid: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        uid: action.uid,
      };
    default:
      return state;
  }
};

export default reducer;
