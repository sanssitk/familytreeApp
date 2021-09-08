import React from "react";
import "./Node.css";

const Node = ({ nodeDatum, child }) => {
  return (
    <div className="nodeMain">
      <div className="nodeImage"></div>
      {child && (
        <div className="nodeInfo">
          <h3>{nodeDatum}</h3>
          <p>Ph: 984137003</p>
          <p>DOB: 2043 B.S.</p>
        </div>
      )}
    </div>
  );
};

export default Node;
