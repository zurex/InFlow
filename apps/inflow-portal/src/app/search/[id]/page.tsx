import { Chat } from 'inflow/components/chat'
import { getChat } from 'inflow/lib/actions/chat'
import { getModels } from 'inflow/lib/config/models'
import { verifyCredential } from 'inflow/lib/dal'
import { convertToUIMessages } from 'inflow/lib/utils'
import { notFound, redirect } from 'next/navigation'

export const maxDuration = 60

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
    const { id } = await props.params
    const {userId} = await verifyCredential();
    const chat = await getChat(id, userId!)
    return {
      title: chat?.title?.toString().slice(0, 50) || 'Search'
    }
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>
}) {
    const {userId} = await verifyCredential();
    const { id } = await props.params

    const chat = await getChat(id, userId!)
    // convertToUIMessages for useChat hook
    const messages = convertToUIMessages(chat?.messages || [])

    if (!chat) {
      redirect('/')
    }

    if (chat?.userId !== userId) {
      notFound()
    }

    const models = await getModels()
    return <Chat id={id} savedMessages={messages} models={models} />
}
