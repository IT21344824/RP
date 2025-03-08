import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton_2 = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary w-full rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""
        }`}
      disabled={isLoading}
    >
      <Text className={`text-blue-600 font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton_2;
