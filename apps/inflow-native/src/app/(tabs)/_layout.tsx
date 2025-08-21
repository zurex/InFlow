import { Stack, Tabs, useSegments } from 'expo-router';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export const unstable_settings = {
    initialRouteName: '(home)/home',
};

export default function AppLayout() {
    const segments = useSegments();

    // Example: hide tab bar on routes containing 'details' segment
    console.log(segments);
    const tabBarVisible = !segments.includes("thread");
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: 'black', 
            headerShown: false,
            tabBarStyle: {
                display: tabBarVisible ? "flex" : "none",
            }
        }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="search-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(library)"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="library-outline" color={color} />,
                }}
            />
        </Tabs>
        
    );
}
