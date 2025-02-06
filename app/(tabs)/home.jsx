import { View, Text, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>home</Text>
      <Button
        title="Go to 3D Models"
        onPress={() => router.push('/3dModels')}
      />

      <Text>scann</Text>
      <Button
        title="Go to scanning"
        onPress={() => router.push('/scanning')}
      />
    </View>
  );
};

export default Home;
