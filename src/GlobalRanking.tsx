import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

interface RankingProps {
  freq: Map<string, number[]>;
  limit?: number;
}

export const GlobalWordRanking = ({ freq, limit = 20 }: RankingProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // 1. Aggregate and Sort
  const sortedWords = Array.from(freq.entries())
    .map(([word, counts]) => ({
      word,
      total: counts.reduce((sum, val) => sum + val, 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);

  // 2. Normalization base
  const maxTotal = sortedWords.length > 0 ? sortedWords[0].total : 1;

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top {limit} Tokens
        </Typography>
        <Grid container spacing={2}>
          {sortedWords.map((item) => {
            const ratio = item.total / maxTotal;
            
            // Perceptual Lightness Calculation:
            // Dark Mode: Linear scaling 40% (Dim) -> 90% (Bright/Glowing)
            // Light Mode: Linear scaling 80% (Pale) -> 30% (Dark/Bold)
            const lightness = isDarkMode 
              ? 40 + (50 * ratio) 
              : 80 - (50 * ratio);

            return (
              <Grid item key={item.word}>
                <Tooltip title={`Frequency: ${item.total}`} arrow placement="top">
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'monospace', 
                      width: 'fit-content',
                      fontWeight: 'bold',
                      // Using HSL allows dynamic lightness adjustment without complex palette manipulation
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
