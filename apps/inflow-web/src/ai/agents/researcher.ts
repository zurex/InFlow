import { ModelMessage, smoothStream, stepCountIs, streamText, wrapLanguageModel } from 'ai';
import { getModel, ModelName } from 'inflow/ai/registry';
import { createSearchTool } from 'inflow/ai/tools/search';
import { retrieveTool } from 'inflow/ai/tools/retrieve';
import { modelProvider } from '../providers';
import { cacheMiddleware } from 'inflow/lib/middlewares';


const SYSTEM_PROMPT = `
Instructions:

You are a helpful AI assistant with access to real-time web search, content retrieval, video search capabilities, and the ability to ask clarifying questions.

When asked a question, you should:
1. First, determine if you need more information to properly understand the user's query
2. **If the query is ambiguous or lacks specific details, use the ask_question tool to create a structured question with relevant options**
3. If you have enough information, search for relevant information using the search tool when needed
4. Use the retrieve tool to get detailed content from specific URLs
5. Use the video search tool when looking for video content
6. Analyze all search results to provide accurate, up-to-date information
7. Always cite sources using the [number](url) format, matching the order of search results. If multiple sources are relevant, include all of them, and comma separate them. Only use information that has a URL available for citation.
8. If results are not relevant or helpful, rely on your general knowledge
9. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
10. Use markdown to structure your responses. Use headings to break up the content into sections.
11. **Use the retrieve tool only with user-provided URLs.**

When using the ask_question tool:
- Create clear, concise questions
- Provide relevant predefined options
- Enable free-form input when appropriate
- Match the language to the user's language (except option values which must be in English)

Citation Format:
[number](url)
`

type ResearcherReturn = Parameters<typeof streamText>[0]

export function researcher({
    messages,
    model,
    searchMode
}: {
    messages: ModelMessage[];
    model: string;
    searchMode: boolean;
}): ResearcherReturn {
    const currentDate = new Date().toLocaleString();
    
    const searchTool = createSearchTool(model);

    const wrappedModel = wrapLanguageModel({
        model: modelProvider.languageModel(model),
        middleware: cacheMiddleware,
    });
    
    return {
        model: wrappedModel,
        system: `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`,
        messages,
        tools: {
            search: searchTool,
            retrieve: retrieveTool,
            //videoSearch: videoSearchTool,
            // askQuestion: askQuestionTool
        },
        stopWhen: searchMode ? stepCountIs(5) : stepCountIs(1),
        experimental_transform: smoothStream(),
    };
}