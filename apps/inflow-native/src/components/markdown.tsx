import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import Link from 'expo-router/link';
import remarkGfm from 'remark-gfm';
import { View, Text } from 'react-native';

const components: Partial<Components> = {
    p: ({ children }) => <Text>{children}</Text>,
    pre: ({ children }) => <>{children}</>,
    ol: ({ node, children, ...props }) => {
        return (
            <View className="list-decimal list-outside ml-4">
                {children}
            </View>
        );
    },
    li: ({ node, children, ...props }) => {
        return (
            <View className="py-1">
                <Text>{children}</Text>
            </View>
        );
    },
    ul: ({ node, children, ...props }) => {
        return (
            <View className="list-decimal list-outside ml-4">
                {children}
            </View>
        );
    },
    strong: ({ node, children, ...props }) => {
        return (
            <Text className="font-semibold">
                {children}
            </Text>
        );
    },
    a: ({ node, children, ...props }) => {
        return (
            <Link
                className="text-blue-500 hover:underline"
                rel="noreferrer"
                href={props.href || ''}
            >
                {children}
            </Link>
        );
    },
    h1: ({ node, children, ...props }) => {
        return (
            <View className="text-3xl font-semibold mt-6 mb-2">
                <Text>{children}</Text>
            </View>
        );
    },
    h2: ({ node, children, ...props }) => {
        return (
            <View className="text-2xl font-semibold mt-6 mb-2">
                <Text>{children}</Text>
            </View>
        );
    },
    h3: ({ node, children, ...props }) => {
        return (
            <View className="text-xl font-semibold mt-6 mb-2">
                <Text>{children}</Text>
            </View>
        );
    },
    h4: ({ node, children, ...props }) => {
        return (
            <View className="text-lg font-semibold mt-6 mb-2">
                <Text>{children}</Text>
            </View>
        );
    },
    h5: ({ node, children, ...props }) => {
        return (
            <View className="text-base font-semibold mt-6 mb-2">
                <Text>{children}</Text>
            </View>
        );
    },
    h6: ({ node, children, ...props }) => {
        return (
        <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
            {children}
        </h6>
        );
    },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
            {content}
        </ReactMarkdown>
    );
};

const Markdown = memo(
    NonMemoizedMarkdown,
    (prevProps, nextProps) => prevProps.content === nextProps.content,
);

export default Markdown;