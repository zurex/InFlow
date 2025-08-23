import { Link } from 'expo-router';
import { useThreadsStore, Thread } from 'inflow/store/threads-store';
import { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, SafeAreaView, Text, View } from 'react-native';
import { stringToTokens, tokensToAST, MarkdownIt, ASTNode } from 'react-native-markdown-display';

export default function HistoryPage() {

    return (
        <SafeAreaView className="flex-1" style={{backgroundColor: '#FCFCF9'}}>
            <View>
                <Text className='p-4'>Libs</Text>
                <ThreadList />
            </View>
        </SafeAreaView>
    )
}

function ThreadList() {

    const { threads, fetchThreads } = useThreadsStore();

    useEffect(() => {
        console.log('[LibraryPage] Fetch all threads now ...');
        fetchThreads();
    }, [fetchThreads]);

    const renderThread = ({ item }: ListRenderItemInfo<Thread>) => {
        const text = item.preview
            ?.filter(part=>part.type=='text')
            .find(part=>part.text!='').text || '';
        const plainText = getPlainText(text);
        const maxSize = 60;
        const previewText = plainText.length > maxSize ? plainText.substring(0, maxSize) + '...' : plainText;
        return (
            <Link href={`/thread/${item.id}`} className='p-4'>
                <View 
                    key={item.id}
                    className='pt-4 pb-4 border-b-[1px] border-gray-100 w-full'
                >
                    <Text className='text-2xl'>{item.title}</Text>
                    <View className='pt-2 '>
                        <Text className='text-base text-gray-500'>{previewText}</Text>
                    </View>
                </View>
            </Link>
        )
    }
    return (
        <FlatList 
            data={threads}
            renderItem={renderThread}
        />
    )
}

// Create an instance of MarkdownIt parser
const markdownParser = new MarkdownIt({ typographer: true });

function getPlainText(markdownText: string) {
    // Convert markdown to AST
    const tokens = stringToTokens(markdownText, markdownParser);
    const ast = tokensToAST(tokens);
    return extractPlainText(ast);
}

// Function to extract plain text from AST recursively
function extractPlainText(node: string | ASTNode | ASTNode[]): string {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractPlainText).join(' ');
    if (node.content) return extractPlainText(node.content);
    if (node.children) return node.children.map(extractPlainText).join(' ');
    return '';
};