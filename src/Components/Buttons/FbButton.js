import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export const FbButton = ({ text, buttonClicked }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      startIcon={<FacebookIcon style={{ fontSize: 24 }} />}
      onClick={buttonClicked}
    >
      <strong>{text}</strong>
    </Button>
  );
};

export default FbButton;
