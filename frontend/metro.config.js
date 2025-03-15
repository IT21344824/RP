const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Apply custom transformer and resolver settings
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: [
      ...resolver.assetExts.filter((ext) => ext !== "svg"),
      "glb",
      "gltf",
      "png",
      "jpg",
      "ttf",
    ],
    sourceExts: [
      ...resolver.sourceExts,
      "svg",
      "js",
      "jsx",
      "json",
      "ts",
      "tsx",
      "cjs",
      "mjs",
    ],
  };

  // Apply NativeWind configuration with input CSS file
  return withNativeWind(config, { input: "./global.css" });
})();
