import type { RetrieveTool } from './tools/retrieve';

export type UIDataTypes = {
    textDelta: string;
    imageDelta: string;
    sheetDelta: string;
    codeDelta: string;
    //suggestion: Suggestion;
    appendMessage: string;
    id: string;
    title: string;
    kind: string;
    clear: null;
    finish: null;
};

export interface Attachment {
    name: string;
    url: string;
    contentType: string;
}

export type ChatTools = {
    retrieve: RetrieveTool;
}