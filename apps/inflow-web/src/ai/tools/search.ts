import { DeepPartial, tool } from 'ai';
import { z } from 'zod';
import { sanitizeUrl } from '../utils';

//#region Schema Definitions

export const searchSchema = z.object({
    query: z.string().describe('The query to search for'),
    max_results: z
        .number()
        .optional()
        .describe('The maximum number of results to return. default is 20'),
    search_depth: z
        .string()
        .optional()
        .describe(
        'The depth of the search. Allowed values are "basic" or "advanced"'
        ),
    include_domains: z
        .array(z.string())
        .optional()
        .describe(
        'A list of domains to specifically include in the search results. Default is None, which includes all domains.'
        ),
    exclude_domains: z
        .array(z.string())
        .optional()
        .describe(
        "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
        )
});

// Strict schema with all fields required
export const strictSearchSchema = z.object({
    query: z.string().describe('The query to search for'),
    max_results: z
        .number()
        .describe('The maximum number of results to return. default is 20'),
    search_depth: z
        .enum(['basic', 'advanced'])
        .describe('The depth of the search'),
    include_domains: z
        .array(z.string())
        .describe(
        'A list of domains to specifically include in the search results. Default is None, which includes all domains.'
        ),
    exclude_domains: z
        .array(z.string())
        .describe(
        "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
        )
});

/**
 * Returns the appropriate search schema based on the full model name.
 * Uses the strict schema for OpenAI models starting with 'o'.
 */
export function getSearchSchemaForModel(fullModel: string) {
    const [provider, modelName] = fullModel?.split(':') ?? []
    const useStrictSchema =
        (provider === 'openai' || provider === 'azure') &&
        modelName?.startsWith('o')

    // Ensure search_depth is an enum for the strict schema
    if (useStrictSchema) {
        return strictSearchSchema
    } else {
        // For the standard schema, keep search_depth as optional string
        return searchSchema
    }
}

export type PartialInquiry = DeepPartial<typeof searchSchema>;

//#endregion

//#region Search Results Types

export type SearchResults = {
    images: SearchResultImage[]
    results: SearchResultItem[]
    number_of_results?: number
    query: string
}

// If enabled the include_images_description is true, the images will be an array of { url: string, description: string }
// Otherwise, the images will be an array of strings
export type SearchResultImage =
    | string
    | {
        url: string
        description: string
        number_of_results?: number
        }

export type ExaSearchResults = {
    results: ExaSearchResultItem[]
}

export type SerperSearchResults = {
    searchParameters: {
        q: string
        type: string
        engine: string
    }
    videos: SerperSearchResultItem[]
}

export type SearchResultItem = {
    title: string
    url: string
    content: string
}

export type ExaSearchResultItem = {
    score: number
    title: string
    id: string
    url: string
    publishedDate: Date
    author: string
}

export type SerperSearchResultItem = {
    title: string
    link: string
    snippet: string
    imageUrl: string
    duration: string
    source: string
    channel: string
    date: string
    position: number
}

//#endregion

//#region Search Implementations

async function tavilySearch(
    query: string,
    maxResults: number = 10,
    searchDepth: 'basic' | 'advanced' = 'basic',
    includeDomains: string[] = [],
    excludeDomains: string[] = []
): Promise<SearchResults> {
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) {
        throw new Error('TAVILY_API_KEY is not set in the environment variables')
    }
    const includeImageDescriptions = true
    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: Math.max(maxResults, 5),
        search_depth: searchDepth,
        include_images: true,
        include_image_descriptions: includeImageDescriptions,
        include_answers: true,
        include_domains: includeDomains,
        exclude_domains: excludeDomains
        })
    })

    if (!response.ok) {
        throw new Error(
        `Tavily API error: ${response.status} ${response.statusText}`
        )
    }

    const data = await response.json()
    const processedImages = includeImageDescriptions
        ? data.images
            .map(({ url, description }: { url: string; description: string }) => ({
            url: sanitizeUrl(url),
            description
            }))
            .filter(
            (
                image: SearchResultImage
            ): image is { url: string; description: string } =>
                typeof image === 'object' &&
                image.description !== undefined &&
                image.description !== ''
            )
        : data.images.map((url: string) => sanitizeUrl(url))

    return {
        ...data,
        images: processedImages
    }
}

//#endregion

/**
 * Creates a search tool with the appropriate schema for the given model.
 */
export function createSearchTool(fullModel: string) {
    return tool({
        description: 'Search the web for information',
        inputSchema: getSearchSchemaForModel(fullModel),
        execute: async ({
            query,
            max_results = 20,
            search_depth = 'basic', // Default for standard schema
            include_domains = [],
            exclude_domains = []
        }) => {
            // Ensure max_results is at least 10
            const minResults = 10;
            const effectiveMaxResults = Math.max(
                max_results || minResults,
                minResults
            );
            const effectiveSearchDepth = search_depth as 'basic' | 'advanced';

            // Tavily API requires a minimum of 5 characters in the query
            const filledQuery =
                query.length < 5 ? query + ' '.repeat(5 - query.length) : query
            let searchResult: SearchResults
            const searchAPI = (process.env.SEARCH_API as 'tavily' | 'exa' | 'searxng') || 'tavily'

            const effectiveSearchDepthForAPI =
                searchAPI === 'searxng' &&
                process.env.SEARXNG_DEFAULT_DEPTH === 'advanced'
                    ? 'advanced'
                    : effectiveSearchDepth || 'basic'

            console.log(
                `Using search API: ${searchAPI}, Search Depth: ${effectiveSearchDepthForAPI}`
            )

            try {
                if (
                    searchAPI === 'searxng' &&
                    effectiveSearchDepthForAPI === 'advanced'
                ) {
                    const baseUrl =
                    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
                    const response = await fetch(`${baseUrl}/api/advanced-search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: filledQuery,
                        maxResults: effectiveMaxResults,
                        searchDepth: effectiveSearchDepthForAPI,
                        includeDomains: include_domains,
                        excludeDomains: exclude_domains
                    })
                })
                if (!response.ok) {
                    throw new Error(
                        `Advanced search API error: ${response.status} ${response.statusText}`
                    )
                }
                searchResult = await response.json()
            } else {
                searchResult = await tavilySearch(
                    filledQuery,
                    effectiveMaxResults,
                    effectiveSearchDepthForAPI,
                    include_domains,
                    exclude_domains
                )
            }
            } catch (error) {
            console.error('Search API error:', error)
            searchResult = {
                results: [],
                query: filledQuery,
                images: [],
                number_of_results: 0
            }
            }

            console.log('completed search')
            return searchResult
        }
    })
}