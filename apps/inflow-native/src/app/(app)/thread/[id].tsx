import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text} from "react-native";
import ReactNativeWebView from "react-native-webview";

export default function ThreadPage() {
    const router = useRouter();
    const { id, limit } = useLocalSearchParams();

    return (
        <SafeAreaView className="flex-1">
            <ReactNativeWebView
                source={{ uri: `https://ai.mote.dev/chat/${id}`}}
            />
        </SafeAreaView>
    );
}