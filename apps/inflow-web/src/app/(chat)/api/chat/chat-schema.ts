import { z } from 'zod';

const textPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000),
});

//const partSchema = z.union([textPartSchema]);

export const PostRequestBodySchema = z.object({
    id: z.string().uuid(),
    message: z.object({
        id: z.string().uuid(),
        role: z.enum(['user']),
        parts: z.array(textPartSchema),
    }),
    selectedChatModel: z.enum(['chat-model', 'chat-model-reasoning']),
    selectedVisibilityType: z.enum(['public', 'private']),
});

export type ChatPostRequestBody = z.infer<typeof PostRequestBodySchema>;
