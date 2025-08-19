import { UseChatHelpers } from '@ai-sdk/react';
import { ChatUIMessage } from 'inflow/ai/message';
import { useState } from 'react';
import { useDataStream } from '../data-stream/data-stream-provider';
import { AnimatePresence, motion } from 'framer-motion';
import { cn, sanitizeText } from 'inflow/lib/utils';
import { PencilEditIcon, SparklesIcon } from '../icons';
import { PreviewAttachment } from './attachment';
import { MessageReasoning } from './message-reasoning';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Markdown } from '../markdown';

interface PreviewMessageProps {
    chatId: string;
    message: ChatUIMessage;
    //vote: Vote | undefined;
    isLoading: boolean;
    setMessages: UseChatHelpers<ChatUIMessage>['setMessages'];
    regenerate: UseChatHelpers<ChatUIMessage>['regenerate'];
    isReadonly: boolean;
    requiresScrollPadding: boolean;
}

export function PreviewMessage({
    chatId,
    message,
    //vote,
    isLoading,
    setMessages,
    regenerate,
    isReadonly,
    requiresScrollPadding,
}: PreviewMessageProps) {
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    const attachmentsFromMessage = message.parts.filter(
        (part) => part.type === 'file',
    );

    useDataStream();

    return (
        <AnimatePresence>
            <motion.div
                data-testid={`message-${message.role}`}
                className="w-full mx-auto max-w-3xl px-4 group/message"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                data-role={message.role}
            >
                <div
                    className={cn(
                        'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
                        {
                        'w-full': mode === 'edit',
                        'group-data-[role=user]/message:w-fit': mode !== 'edit',
                        },
                    )}
                >
                    {message.role === 'assistant' && (
                        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
                        <div className="translate-y-px">
                            <SparklesIcon size={14} />
                        </div>
                        </div>
                    )}

                    <div
                        className={cn('flex flex-col gap-4 w-full', {
                        'min-h-96': message.role === 'assistant' && requiresScrollPadding,
                        })}
                    >
                        {attachmentsFromMessage.length > 0 && (
                            <div
                                data-testid={`message-attachments`}
                                className="flex flex-row justify-end gap-2"
                            >
                                {attachmentsFromMessage.map((attachment) => (
                                    <PreviewAttachment
                                        key={attachment.url}
                                        attachment={{
                                            name: attachment.filename ?? 'file',
                                            contentType: attachment.mediaType,
                                            url: attachment.url,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {message.parts?.map((part, index) => {
                            const { type } = part;
                            const key = `message-${message.id}-part-${index}`;

                            if (type === 'reasoning' && part.text?.trim().length > 0) {
                                return (
                                    <MessageReasoning
                                        key={key}
                                        isLoading={isLoading}
                                        reasoning={part.text}
                                    />
                                );
                            }

                            if (type === 'text') {
                                if (mode === 'view') {
                                return (
                                    <div key={key} className="flex flex-row gap-2 items-start">
                                        {message.role === 'user' && !isReadonly && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        data-testid="message-edit-button"
                                                        variant="ghost"
                                                        className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                                                        onClick={() => {
                                                            setMode('edit');
                                                        }}
                                                    >
                                                        <PencilEditIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit message</TooltipContent>
                                            </Tooltip>
                                        )}

                                        <div
                                            data-testid="message-content"
                                            className={cn('flex flex-col gap-4', {
                                            'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                                                message.role === 'user',
                                            })}
                                        >
                                            <Markdown>{sanitizeText(part.text)}</Markdown>
                                        </div>
                                    </div>
                                );
                                }

                                if (mode === 'edit') {
                                    return (
                                        <div key={key} className="flex flex-row gap-2 items-start">
                                        <div className="size-8" />

                                        </div>
                                    );
                                }
                            }

                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
  );
}