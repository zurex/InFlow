/* eslint-disable @typescript-eslint/no-explicit-any */
import { Artifact } from './artifact-common';

export const ArtifactDefinitions: Artifact<any, any>[] = [];

export interface UIArtifact {
    title: string;
    documentId: string;
    kind: string;
    content: string;
    isVisible: boolean;
    status: 'streaming' | 'idle';
    boundingBox: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}