module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        // Temporarily disable NativeWind JSX import source
        // jsxImportSource: "nativewind"
      }],
      // Temporarily disable NativeWind babel preset
      // "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
