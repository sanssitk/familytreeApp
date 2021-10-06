import { data } from "browserslist";
import React from "react";
import "./footer.css";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className="footer">
      {year} ©Copyright. All rights reserved by Sanjay Shrestha
    </div>
  );
};

export default Footer;
