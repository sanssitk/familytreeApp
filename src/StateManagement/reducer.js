// intital user
export const initialState = {
    profileIsOpen: false,
    resumeIsOpen: false,
    portfolioIsOpen: false,
  };
  
  // setting up user layer
  // export const actionTypes = {
  //     SET_OPEN : "SET_OPEN",
  // };
  
  const reducer = (state, action) => {
  
    switch (action.type) {
      case "SET_PROFILE":
        return {
          ...state, 
          profileIsOpen: action.profileIsOpen,
        };
      case "SET_RESUME":
        return {
          ...state, 
          resumeIsOpen: action.resumeIsOpen,
        };
      case "SET_PORTFOLIO":
        return {
          ...state, 
          portfolioIsOpen: action.portfolioIsOpen,
        };
      
      default:
        return state;
    }
  };
  
  export default reducer;
  