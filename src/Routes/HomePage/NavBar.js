import React, { useState } from "react";
import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    padding: 8,
    top: 45,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 4,
    width: 160,
    zIndex: 1,
    border: "1px solid",
    backgroundColor: theme.palette.background.paper,
    transition: "all 0.6s easein",
  },
}));

function NavBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <div className="navbar__left__title">
            <IconButton className="avatar">
              <Avatar src={"Src"} alt={"Src"} />
            </IconButton>
            <div className="avatar__greeting">
              <span>Hello!</span>
              <strong>Sanjay Shrestha</strong>
            </div>
            <ClickAwayListener onClickAway={handleClickAway}>
              <div className={classes.root}>
                <div type="button" onClick={handleClick}>
                  <ArrowDropDownIcon />
                </div>
                {open ? (
                  <div className={classes.dropdown}>Sign Off!</div>
                ) : null}
                {/* classes={{root: classes.inputRoot, input: classes.inputInput }} */}
              </div>
            </ClickAwayListener>
          </div>
        </div>
        <div className="navbar__center">
          <SearchIcon fontSize="small" color="action" />
          <input type="text" />
        </div>

        <div className="navbar__right">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/allfamily">All Family</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
