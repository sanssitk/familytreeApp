import React from "react";

const Rules = ({ rule }) => {
  return (
    <div className="rules">
      <span>🟡</span>
      <p>{rule}</p>
    </div>
  );
};

export default Rules;
