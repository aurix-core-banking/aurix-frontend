import React from 'react';
import { View } from 'react-native';

const Icon = ({ name, size, color, style }) => {
  return <View style={[{ width: size || 20, height: size || 20 }, style]} />;
};

export default Icon;
