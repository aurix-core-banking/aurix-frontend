import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ children, style, colors, ...props }) => {
  return <View style={[{ backgroundColor: colors ? colors[0] : '#fff' }, style]}>{children}</View>;
};

export default LinearGradient;
