import { useMemo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface RankingProps {
  freq: Map<string, number[]>;
  limit?: number;
}

export const TopTokens = ({ freq, limit = 20 }: RankingProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // 1. Memoized Aggregation and Statistics
  const { topWords, maxTotal, uniqueCount, totalVolume } = useMemo(() => {
    let globalSum = 0;
    const allWords = [];

    // Single pass for summation and array construction
    for (const [word, counts] of freq.entries()) {
      const wordTotal = counts.reduce((sum, val) => sum + val, 0);
      globalSum += wordTotal;
      allWords.push({ word, total: wordTotal });
    }

    // Sort descending
    allWords.sort((a, b) => b.total - a.total);

    return {
      topWords: allWords.slice(0, limit),
      maxTotal: allWords.length > 0 ? allWords[0].total : 1,
      uniqueCount: freq.size,
      totalVolume: globalSum
    };
  }, [freq, limit]);

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
          <Typography variant="h6">
            Top {limit} most frequent Tokens
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            Vocabulary: {uniqueCount} | Tokens: {totalVolume}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {topWords.map((item) => {
            const ratio = item.total / maxTotal;
            
            // Luminosity: Dark Mode (40-90%), Light Mode (80-30%)
            const lightness = isDarkMode 
              ? 40 + (50 * ratio) 
              : 80 - (50 * ratio);

            return (
              <Grid key={item.word}>
                <Tooltip title={`Frequency: ${item.total}`} arrow placement="top">
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'monospace', 
                      width: 'fit-content',
                      fontWeight: 'bold',
                      color: `hsl(210, 100%, ${lightness}%)`,
                      cursor: 'default',
                      '&:hover': { 
                        color: 'secondary.main', 
                        transition: 'color 0.2s'
                      } 
                    }}
                  >
                    {item.word}
                  </Typography>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};
