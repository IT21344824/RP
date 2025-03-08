import React, { useState } from 'react';
import { View, Text, Button, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const Scann = () => {
  const [image, setImage] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendImageToServer = async () => {
    if (!image) {
      Alert.alert('Error', 'No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      console.log('Sending image to server...');
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponseData(response.data);
      Alert.alert('Success', `Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', `Failed to upload image: ${error.message}`);
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Click image</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 20 }} />}
      <Button title="Upload Image" onPress={sendImageToServer} />
      {responseData && <Text>Response: {JSON.stringify(responseData, null, 2)}</Text>}
    </View>
  );
};

export default Scann;
