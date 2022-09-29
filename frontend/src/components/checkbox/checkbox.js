import React from "react";

const Checkbox = ({ id, type, name, handleClick, isCheck }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      onChange={handleClick}
      checked={isCheck}
    />
  );
};

export default Checkbox;
