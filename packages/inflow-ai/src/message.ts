import type { UIMessage } from 'ai';
import { z } from 'zod';
import type { ChatTools, UIDataTypes } from './common';

export const MessageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof MessageMetadataSchema>;

export type ChatUIMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>;
