import { useMemo } from 'react';
import { ResponsiveLineCanvas } from '@nivo/line';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TokenFreqProps {
  freq: Map<string, number[]>;
  tokens: string[];
}

export const TokenFreqOverPages = ({ freq, tokens }: TokenFreqProps) => {
  const theme = useTheme();

  // Transform data: tokens[] -> Array<{ id, data: [{x, y}] }>
  const chartData = useMemo(() => {
    return tokens.map((token) => {
      const pageCounts = freq.get(token) || [];
      return {
        id: token,
        data: pageCounts.map((count, index) => ({
          x: index + 1,
          y: count,
        })),
      };
    }).filter(series => series.data.length > 0);
  }, [freq, tokens]);

  return (
    <Card variant="outlined" sx={{ mb: 4, width: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Token Frequency Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Comparing {tokens.length} tokens
        </Typography>

        <Box sx={{ height: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveLineCanvas
              data={chartData}
              margin={{ top: 20, right: 110, bottom: 60, left: 60 }} // Increased right margin for legend
              xScale={{ type: 'linear' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
              enablePoints={false} 
              enableGridX={false}
              isInteractive={true}
              pixelRatio={window.devicePixelRatio}
              lineWidth={1.5}
              colors={{ scheme: 'category10' }} // Standard categorical scheme
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  itemTextColor: theme.palette.text.secondary,
                }
              ]}
              theme={{
                text: {
                  fill: theme.palette.text.primary,
                },
                axis: {
                  ticks: {
                    text: { fill: theme.palette.text.secondary },
                  },
                  legend: {
                    text: { fill: theme.palette.text.secondary },
                  },
                },
                grid: {
                  line: { stroke: theme.palette.divider },
                },
                crosshair: {
                  line: {
                    stroke: theme.palette.text.secondary,
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                  },
                },
                tooltip: {
                  container: {
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                  },
                },
              }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Page Number',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Frequency',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
            />
          ) : (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
            >
              <Typography color="text.secondary">No data found for selected tokens</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
