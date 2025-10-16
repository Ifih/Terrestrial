'use client'

/**
 * A client-side component that wraps the application with the `next-themes` ThemeProvider.
 * This enables light/dark mode and other theme-related functionality.
 */
import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
