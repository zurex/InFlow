import { format } from "date-fns";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, SafeAreaView, Text, View, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Greeting, SuggestedActions } from 'inflow/components/greetting';
import Ionicons from "@react-native-vector-icons/ionicons";

const { width, height } = Dimensions.get('window');

export default function Page() {
	const imageUrl = 'https://images.unsplash.com/photo-1725610588086-b9e38da987f7?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
	console.log('image url', imageUrl);
	return (
		<SafeAreaView className="flex flex-1" style={{backgroundColor: '#FCFCF9'}}>
			<Header />
			<Greeting />
			<Footer />
		</SafeAreaView>
	);
}

function Header() {
	// <Ionicons name="settings-outline" size={24}/>
	const today = format(new Date(), "M月d日"); // 返回 2025-08-22 这种格式
	return (
		<View className="px-4 lg:px-6 h-14 flex items-center flex-row justify-between ">
			<View className="flex-row items-center justify-start gap-2">
				<Text className="font-bold text-4xl">
					今天
				</Text>
				<Text className="text-2xl text-zinc-500">{today}</Text>
			</View>
			<View className="flex flex-row gap-4 sm:gap-6">
				<Ionicons name="settings-outline" size={24}/>
			</View>
		</View>
	);
}

function Content() {
	return (
		<View className="flex-1 min-h-3">
			<View className="py-12 md:py-24 lg:py-32 xl:py-48">
				<View className="px-4 md:px-6">
					<View className="flex flex-col items-center gap-4 text-center">
						<Text
						role="heading"
						className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
						>
						Welcome to Project MOTE
						</Text>
						<Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
						Discover and collaborate on mote. Explore our services now.
						</Text>

					</View>
				</View>
			</View>
		</View>
	);
}

function Footer() {
	const router = useRouter();
	const { bottom } = useSafeAreaInsets();
	console.log('bu', bottom);
	return (
		<View
			className="flex shrink-0 px-6"
		>
			<SuggestedActions />
			<View 
				className="min-h-32 pt-5 pb-10"
			>
				<Pressable 
					className="flex-1 bg-[--secondary-background] rounded-2xl justify-center" 
					onPress={() => {router.navigate("/ask")}}
				>
					<Text className={"text-center text-2xl text-gray-700"}>
						随意提问，随意探索
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

