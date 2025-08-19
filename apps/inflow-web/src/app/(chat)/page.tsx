import { DataStreamHandler } from 'inflow/components/data-stream/data-stream-handler';
import { AskThread } from 'inflow/components/thread/ask-thread';
import { generateUUID } from 'inflow/lib/utils';

export default function Home() {
    const id = generateUUID();
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
