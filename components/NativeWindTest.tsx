import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NativeWindTest() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-6 justify-center items-center">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        NativeWind Test
      </Text>
      <View className="bg-purple-600 p-4 rounded-xl mb-4">
        <Text className="text-white font-semibold">Purple Card</Text>
      </View>
      <TouchableOpacity className="bg-gray-200 dark:bg-gray-800 px-6 py-3 rounded-lg">
        <Text className="text-gray-900 dark:text-white">Test Button</Text>
      </TouchableOpacity>
    </View>
  );
}
