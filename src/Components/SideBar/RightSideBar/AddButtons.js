import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../../StateManagement/StateProvider";
import { dbServices } from "../../../Services/firebaseServices";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

const AddButtons = ({ buttonlist }) => {
  const [open, setOpen] = useState(false);
  const [{ fbKey }, dispatch] = useStateValue();

  let history = useHistory();

  const checkFather = (value) => {
    if (!value || value == "") {
      dispatch({
        type: "ADD_MEMBER",
        member: buttonlist,
      });
      history.push(`/add${buttonlist}`);
    } else {
      setOpen(true);
    }
  };

  const handleAddButtonClicked = (e) => {
    e.preventDefault();
    const currentButton = e.currentTarget.id;
    if (currentButton !== "Father") {
      dispatch({
        type: "ADD_MEMBER",
        member: e.currentTarget.id,
      });
      history.push(`/add${e.currentTarget.id}`);
    } else {
      dbServices.keyValue(fbKey).on("value", (snapshot) => {
        const relsValue = snapshot.child("rels/father").val();
        checkFather(relsValue);
      });
    }
    if (open) setOpen(false);
  };

  const renderNotAllowedModal = () => {
    return (
      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="small"
      >
        <Header icon>
          <Icon name="user" />
          Father Already Added
        </Header>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  return (
    <>
      <div
        className="ui button animated fade primary"
        tabIndex="0"
        onClick={handleAddButtonClicked}
        id={buttonlist}
      >
        {renderNotAllowedModal()}
        <div className="visible content">
          <i className="add icon"></i>
          {buttonlist}
        </div>
        <div className="hidden content">
          <i className="add icon"></i>
          <i className="icon user"></i>
        </div>
      </div>
    </>
  );
};

export default AddButtons;
