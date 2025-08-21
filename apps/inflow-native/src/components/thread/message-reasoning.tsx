import { useState } from 'react';

interface MessageReasoningProps {
  isLoading: boolean;
  reasoning: string;
}

export function MessageReasoning({
  isLoading,
  reasoning,
}: MessageReasoningProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="flex flex-col"></div>
    );
}