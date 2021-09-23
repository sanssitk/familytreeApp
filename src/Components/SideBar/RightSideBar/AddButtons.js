import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../../StateManagement/StateProvider";

const AddButtons = ({ buttonlist }) => {
  const [{  }, dispatch] = useStateValue();

  let history = useHistory();

  const handleAddButtonClicked = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_MEMBER",
      member: e.currentTarget.id,
    });

    history.push(`/add${e.currentTarget.id}`);
  };

  return (
    <div
      className="ui button animated fade primary"
      tabIndex="0"
      onClick={handleAddButtonClicked}
      id={buttonlist}
    >
      <div className="visible content">
        <i className="add icon"></i>
        {buttonlist}
      </div>
      <div className="hidden content">
        <i className="add icon"></i>
        <i className="icon user"></i>
      </div>
    </div>
  );
};

export default AddButtons;
