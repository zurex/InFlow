import { Stack } from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'home',
    library: {
        initialRouteName: 'library',
    },
};

export default function DynamicLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='thread' />
            <Stack.Screen 
                name="ask"  
                options={{
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}
