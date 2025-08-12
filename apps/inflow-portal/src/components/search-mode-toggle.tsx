'use client'

import { cn } from 'inflow/lib/utils'
import { getCookie, setCookie } from 'inflow/lib/utils/cookies';
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toggle } from './ui/toggle'

export function SearchModeToggle() {
    const [isSearchMode, setIsSearchMode] = useState(true)

    useEffect(() => {
        const savedMode = getCookie('search-mode')
        if (savedMode !== null) {
            setIsSearchMode(savedMode === 'true')
        }
    }, [])

    const handleSearchModeChange = (pressed: boolean) => {
        setIsSearchMode(pressed)
        setCookie('search-mode', pressed.toString())
    }

    return (
      <Toggle
        aria-label="Toggle search mode"
        pressed={isSearchMode}
        onPressedChange={handleSearchModeChange}
        variant="outline"
        className={cn(
          'gap-1 px-3 border border-input text-muted-foreground bg-background',
          'data-[state=on]:bg-blue-50',
          'data-[state=on]:text-blue-500',
          'data-[state=on]:border-blue-200',
          'hover:bg-accent hover:text-accent-foreground rounded-full'
        )}
      >
        <Globe className="size-4" />
        <span className="text-xs">Search</span>
      </Toggle>
    )
}
