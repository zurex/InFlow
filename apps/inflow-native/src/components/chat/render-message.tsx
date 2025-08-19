import { ChatRequestOptions, UIMessage, } from 'ai';
import { useMemo } from 'react';

interface RenderMessageProps {
    message: UIMessage
    messageId: string
    getIsOpen: (id: string) => boolean
    onOpenChange: (id: string, open: boolean) => void
    onQuerySelect: (query: string) => void
    chatId?: string
    addToolResult?: (params: { toolCallId: string; result: any }) => void
    onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
    reload?: (
        messageId: string,
        options?: ChatRequestOptions
    ) => Promise<string | null | undefined>
}

export function RenderMessage({
  message,
  messageId,
  getIsOpen,
  onOpenChange,
  onQuerySelect,
  chatId,
  addToolResult,
  onUpdateMessage,
  reload
}: RenderMessageProps) {
    const relatedQuestions = useMemo(
    () =>
      message.annotations?.filter(
        annotation => (annotation as any)?.type === 'related-questions'
      ),
    [message.annotations]
  )
}
