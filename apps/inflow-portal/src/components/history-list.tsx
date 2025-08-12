import React, { cache } from 'react'
import HistoryItem from './history-item';
import { Chat } from 'inflow/lib/types';
import { getChats } from 'inflow/lib/actions/chat';
import { ClearHistory } from './clear-history';
import { verifyCredential } from 'inflow/lib/dal';
import { ANONYMOUS_USER_ID } from 'inflow/lib/constants';

type HistoryListProps = {
  userId?: string
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

// Start of Selection
export async function HistoryList({ }: HistoryListProps) {
  const { userId } = await verifyCredential();
  if (!userId || userId === ANONYMOUS_USER_ID) {
    return null
  }
  const chats = await getChats(userId)

  return (
    <div className="flex flex-col flex-1 space-y-3 h-full">
      <div className="flex flex-col space-y-0.5 flex-1 overflow-y-auto">
        {!chats?.length ? (
          <div className="text-foreground/30 text-sm text-center py-4">
            No search history
          </div>
        ) : (
          chats?.map(
            (chat: Chat) => chat && <HistoryItem key={chat.id} chat={chat} />
          )
        )}
      </div>
      <div className="mt-auto">
        <ClearHistory userId={userId!} empty={!chats?.length} />
      </div>
    </div>
  )
}
