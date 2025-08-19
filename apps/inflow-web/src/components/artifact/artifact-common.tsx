import { UseChatHelpers } from '@ai-sdk/react';
import { DataUIPart } from 'ai';
import { UIDataTypes } from 'inflow/ai/common';
import { ChatUIMessage } from 'inflow/ai/message';
import { ComponentType, Dispatch, ReactNode, SetStateAction } from 'react';
import { UIArtifact } from './artifact';

export type ArtifactActionContext<M = unknown> = {
    content: string;
    handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
    currentVersionIndex: number;
    isCurrentVersion: boolean;
    mode: 'edit' | 'diff';
    metadata: M;
    setMetadata: Dispatch<SetStateAction<M>>;
};

type ArtifactAction<M = unknown> = {
    icon: ReactNode;
    label?: string;
    description: string;
    onClick: (context: ArtifactActionContext<M>) => Promise<void> | void;
    isDisabled?: (context: ArtifactActionContext<M>) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ArtifactContent<M = unknown> {
    title: string;
    content: string;
    mode: 'edit' | 'diff';
    isCurrentVersion: boolean;
    currentVersionIndex: number;
    status: 'streaming' | 'idle';
    //suggestions: Array<Suggestion>;
    onSaveContent: (updatedContent: string, debounce: boolean) => void;
    isInline: boolean;
    getDocumentContentById: (index: number) => string;
    isLoading: boolean;
    metadata: M;
    setMetadata: Dispatch<SetStateAction<M>>;
}

export type ArtifactToolbarContext = {
    sendMessage: UseChatHelpers<ChatUIMessage>['sendMessage'];
};

export type ArtifactToolbarItem = {
    description: string;
    icon: ReactNode;
    onClick: (context: ArtifactToolbarContext) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface InitializeParameters<M = any> {
    documentId: string;
    setMetadata: Dispatch<SetStateAction<M>>;
}

type ArtifactConfig<T extends string, M = unknown> = {
    kind: T;
    description: string;
    content: ComponentType<ArtifactContent<M>>;
    actions: Array<ArtifactAction<M>>;
    toolbar: ArtifactToolbarItem[];
    initialize?: (parameters: InitializeParameters<M>) => void;
    onStreamPart: (args: {
        setMetadata: Dispatch<SetStateAction<M>>;
        setArtifact: Dispatch<SetStateAction<UIArtifact>>;
        streamPart: DataUIPart<UIDataTypes>;
    }) => void;
};

export class Artifact<T extends string, M = unknown> {
    readonly kind: T;
    readonly description: string;
    readonly content: ComponentType<ArtifactContent<M>>;
    readonly actions: Array<ArtifactAction<M>>;
    readonly toolbar: ArtifactToolbarItem[];
    readonly initialize?: (parameters: InitializeParameters) => void;
    readonly onStreamPart: (args: {
        setMetadata: Dispatch<SetStateAction<M>>;
        setArtifact: Dispatch<SetStateAction<UIArtifact>>;
        streamPart: DataUIPart<UIDataTypes>;
    }) => void;

    constructor(config: ArtifactConfig<T, M>) {
        this.kind = config.kind;
        this.description = config.description;
        this.content = config.content;
        this.actions = config.actions || [];
        this.toolbar = config.toolbar || [];
        this.initialize = config.initialize || (async () => ({}));
        this.onStreamPart = config.onStreamPart;
    }
}