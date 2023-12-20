import React from 'react'
import { SafeAreaView, View } from 'react-native'
import WebView from 'react-native-webview'

export default function WebviewScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <WebView
          source={{ uri: 'https://blackcatagency.co' }}
        />
      </View>
    </SafeAreaView>
  )
}