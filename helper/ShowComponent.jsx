import React from 'react';

const ShowComponent = ({ condition, children }) => {
  return condition ? <>{children}</> : null;
};

export default ShowComponent;
