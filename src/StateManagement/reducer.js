// intital data

export const initialState = {
  user: null,
  uid: null,
  nodeId: null,
  member: null,
  fbKey: null,
  isOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        uid: action.uid,
      };
    case "FB_KEY":
      return {
        ...state,
        fbKey: action.fbKey,
      };
    case "NODE_ID":
      return {
        ...state,
        nodeId: action.nodeId,
      };
    case "ADD_MEMBER":
      return {
        ...state,
        member: action.member,
      };
    case "BAR_OPEN":
      return {
        ...state,
        isOpen: action.isOpen,
      };
    default:
      return state;
  }
};

export default reducer;
