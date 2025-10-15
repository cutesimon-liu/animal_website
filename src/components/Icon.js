import React from 'react';
import * as GiIcons from 'react-icons/gi';

const Icon = ({ name, ...props }) => {
  const IconComponent = GiIcons[name];
  if (!IconComponent) return <GiIcons.GiPaw {...props} />; // Return a default icon if not found
  return <IconComponent {...props} />;
};

export default Icon;
