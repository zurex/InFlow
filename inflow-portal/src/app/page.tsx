import { Chat } from 'inflow/components/chat';
import { getModels } from 'inflow/lib/config/models';
import { generateId } from 'ai'

export default async function HomePage() {
    const id = generateId()
    const models = await getModels()
    return <Chat id={id} models={models} />
}
