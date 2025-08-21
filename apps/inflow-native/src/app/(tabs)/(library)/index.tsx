import { useState } from 'react';
//import { Thread } from '@prisma/client';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

export default function HistoryPage() {

    return (
        <SafeAreaView className="flex-1" >
            <View className='p-2'>
                <Text>Libs</Text>
                <ThreadList />
            </View>
        </SafeAreaView>
    )
}

function ThreadList() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const renderThread = (thread: any) => {
        return (
            <View>

            </View>
        )
    }
    return (
        <FlatList 
            data={data}
            renderItem={renderThread}
        />
    )
}