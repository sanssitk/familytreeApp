// intital data

export const initialState = {
  user: null,
  uid: null,
  nodeId: 2,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        uid: action.uid,
      };
    case "NODE_ID":
      return {
        ...state,
        nodeId: action.nodeId,
      };
    default:
      return state;
  }
};

export default reducer;
