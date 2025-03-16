import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";


interface FormInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: (e: any) => void;
    error?: string | boolean;
    secureTextEntry?: boolean;
    showPassword?: boolean;
    togglePassword?: () => void;
  }
  
  const formLogin: React.FC<FormInputProps> = ({
    placeholder,
    value,
    onChangeText,
    onBlur,
    error,
    secureTextEntry,
    showPassword,
    togglePassword,
  }) => {
    return (
      <View className=" mb-5">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="gray"
          className="bg-gray-200 text-black p-4 rounded-lg"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          secureTextEntry={secureTextEntry}
        />
        {togglePassword && (
          <TouchableOpacity className="absolute right-4 top-3" onPress={togglePassword}>
            {showPassword ? <EyeSlashIcon size={24} color="black" /> : <EyeIcon size={24} color="black" />}
          </TouchableOpacity>
        )}
        {error && <Text className="text-red-500 mt-1">{error}</Text>}
      </View>
    );
  };
  
  export default formLogin;
