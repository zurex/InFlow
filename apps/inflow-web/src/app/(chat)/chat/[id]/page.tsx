import { DataStreamHandler } from 'inflow/components/data-stream/data-stream-handler';
import { AskThread } from 'inflow/components/thread/ask-thread';

export default async function Home(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    return (
        <>
            <AskThread 
                id={id}
                initialChatModel='chat-model'
                initialMessages={[]}
                isReadonly={false}
            />
            <DataStreamHandler />
        </>
    );
}
