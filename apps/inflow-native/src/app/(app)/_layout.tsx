import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(root)',
};

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="thread" />
      <Stack.Screen 
        name="ask"  
        options={{
          presentation: 'modal',
        }}/>
    </Stack>
  );
}
