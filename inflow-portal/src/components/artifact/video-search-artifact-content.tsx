'use client'

import { ToolArgsSection } from 'inflow/components/section'
import { VideoResultGrid } from 'inflow/components/video-result-grid'
import {
  type SerperSearchResultItem,
  type SerperSearchResults
} from 'inflow/lib/types'
import type { ToolInvocation } from 'ai'

export function VideoSearchArtifactContent({ tool }: { tool: ToolInvocation }) {
  const videoResults: SerperSearchResults | undefined =
    tool.state === 'result' ? tool.result : undefined
  const query = tool.args?.query as string | undefined

  const videos = (videoResults?.videos || []).filter(
    (video: SerperSearchResultItem) => {
      try {
        return new URL(video.link).pathname === '/watch'
      } catch (e) {
        console.error('Invalid video URL:', video.link)
        return false
      }
    }
  )

  if (videos.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <ToolArgsSection tool="videoSearch">{query}</ToolArgsSection>
        <p className="text-muted-foreground">No video results</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <ToolArgsSection tool="videoSearch">{query}</ToolArgsSection>
      <VideoResultGrid
        videos={videos}
        query={query || ''}
        displayMode="artifact"
      />
    </div>
  )
}