import { useMemo } from 'react'
import { Box, Typography, Chip, Stack } from '@mui/material'
import type { Frequencies } from './types'

type TopLongestTokensProps = {
  freq: Frequencies
  limit: number
}

export function TopLongestTokens({ freq, limit }: TopLongestTokensProps) {
  // 1. Transform Map keys to array, sort by length, slice to limit
  const tokens = useMemo(() => {
    return Array.from(freq.keys())
      .sort((a, b) => b.length - a.length)
      .slice(0, limit)
  }, [freq, limit])

  // 2. Color interpolation logic (Blue 220 -> Teal 170)
  const getBackgroundColor = (index: number, count: number) => {
    const startHue = 220
    const endHue = 170
    // Avoid division by zero if count is 1
    const factor = count > 1 ? index / (count - 1) : 0
    const hue = startHue - (startHue - endHue) * factor
    return `hsl(${hue}, 75%, 45%)`
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Top {limit} Longest Tokens
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {tokens.map((token, index) => (
          <Chip
            key={token}
            label={token}
            sx={{
              backgroundColor: getBackgroundColor(index, tokens.length),
              color: '#fff',
              fontFamily: 'monospace', // Enhances scientific readability
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}
