import React from 'react';

const Image = (props) => {
  const { ...rest } = props;
  return React.createElement('img', rest);
};

export default Image;
