import { UIMessage, UseChatHelpers } from '@ai-sdk/react';
import { Attachment } from '@inflow/ai/common';
import { useScrollToBottom } from 'inflow/hooks/use-scroll-to-bottom';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ArrowDown } from 'lucide-react';
import cx from 'classnames';
import { toast } from 'sonner';
import { ChatUIMessage } from '@inflow/ai/message';

interface MultimodalInputProps {
    chatId: string;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
    status: UseChatHelpers<ChatUIMessage>['status'];
    stop: () => void;
    attachments: Array<Attachment>;
    setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
    messages: Array<UIMessage>;
    setMessages: UseChatHelpers<ChatUIMessage>['setMessages'];
    sendMessage: UseChatHelpers<ChatUIMessage>['sendMessage'];
    className?: string;
    //selectedVisibilityType: VisibilityType;
}

export function MultimodalInput({
    chatId,
    input,
    setInput,
    status,
    stop,
    messages,
    setMessages,
    sendMessage,
    className = '',
    attachments,
    setAttachments,
    //selectedVisibilityType
}: MultimodalInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { width } = useWindowSize();

    useEffect(() => {
        if (textareaRef.current) {
            adjustHeight();
        }
    }, []);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
        }
    };

    const resetHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = '98px';
        }
    };

    const [localStorageInput, setLocalStorageInput] = useLocalStorage(
        'input',
        '',
    );

    useEffect(() => {
        if (textareaRef.current) {
            const domValue = textareaRef.current.value;
            // Prefer DOM value over localStorage to handle hydration
            const finalValue = domValue || localStorageInput || '';
            setInput(finalValue);
            adjustHeight();
        }
        // Only run once after hydration
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLocalStorageInput(input);
    }, [input, setLocalStorageInput]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
        adjustHeight();
    };

    const submitForm = useCallback(() => {
        //window.history.replaceState({}, '', `/chat/${chatId}`);

        sendMessage({
            role: 'user',
            parts: [
                ...attachments.map((attachment) => ({
                    type: 'file' as const,
                    url: attachment.url,
                    name: attachment.name,
                    mediaType: attachment.contentType,
                })),
                {
                    type: 'text',
                    text: input,
                },
            ],
        });

        setAttachments([]);
        setLocalStorageInput('');
        resetHeight();
        setInput('');

        if (width && width > 768) {
            textareaRef.current?.focus();
        }
    }, [
        input,
        setInput,
        attachments,
        sendMessage,
        setAttachments,
        setLocalStorageInput,
        width,
        chatId,
    ]);

    const { isAtBottom, scrollToBottom } = useScrollToBottom();

    useEffect(() => {
        if (status === 'submitted') {
            scrollToBottom();
        }
    }, [status, scrollToBottom]);

    return (
        <div className="relative w-full flex flex-col gap-4">
            <AnimatePresence>
                {!isAtBottom && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute left-1/2 bottom-28 -translate-x-1/2 z-50"
                    >
                        <Button
                            data-testid="scroll-to-bottom-button"
                            className="rounded-full"
                            size="icon"
                            variant="outline"
                            onClick={(event) => {
                                event.preventDefault();
                                scrollToBottom();
                            }}
                        >
                            <ArrowDown />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Textarea
                data-testid="multimodal-input"
                ref={textareaRef}
                placeholder="Send a message..."
                value={input}
                onChange={handleInput}
                className={cx(
                    'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
                    className,
                )}
                rows={2}
                autoFocus
                onKeyDown={(event) => {
                    if (
                        event.key === 'Enter' &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                    ) {
                        event.preventDefault();

                        if (status !== 'ready') {
                            toast.error('Please wait for the model to finish its response!');
                        } else {
                            submitForm();
                        }
                    }
                }}
            />
        </div>
    );
}