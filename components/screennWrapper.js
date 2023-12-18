import { View, Platform } from 'react-native'
import React from 'react'

export default function ScreennWrapper({ children }) {
  let statusBarHeight = Platform.OS == 'ios' ? 30 : 0;
  return (
    <View style={{ paddingTop: statusBarHeight }}>
      {children}
    </View>
  )
}