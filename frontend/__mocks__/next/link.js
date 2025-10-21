import React from 'react';

const Link = ({ children, href }) => {
  return React.createElement('a', { href }, children);
};

export default Link;