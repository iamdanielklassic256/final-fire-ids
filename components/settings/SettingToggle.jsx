import {  Switch } from 'react-native'
import React from 'react'

const SettingToggle = ({ value, onValueChange }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#D1D5DB", true: "#C7D2FE" }}
      thumbColor={value ? "#4F46E5" : "#9CA3AF"}
    />
  );

export default SettingToggle