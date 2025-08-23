import { Stack, Tabs, useSegments } from 'expo-router';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export const unstable_settings = {
    initialRouteName: '(home)/home',
};

export default function AppLayout() {
    const segments = useSegments();

    // Example: hide tab bar on routes containing 'details' segment
    console.log('segments', segments);
    const tabBarVisible = !segments.includes("thread");
    const showBorder = !segments.includes("(home)") && segments.length > 1;
    console.log('ShowBorder', showBorder);
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: 'black', 
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
                display: tabBarVisible ? "flex" : "none",
                backgroundColor: '#FCFCFC',
                borderTopWidth: showBorder ? 1 : 0,
                alignItems: 'center'
            },
            tabBarIconStyle: {
                marginTop: 8,  // Push icon downward to center it vertically
                // or you can use top: 8 if margin doesn't work as expected
            },
        }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="search-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(library)"
                options={{
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="library-outline" color={color} />,
                }}
            />
        </Tabs>
        
    );
}
