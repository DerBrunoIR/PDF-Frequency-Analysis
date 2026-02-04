import { useMemo } from 'react';
import { ResponsiveBarCanvas } from '@nivo/bar';
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

  const { data: chartData, keys } = useMemo(() => {
    if (!tokens.length) return { data: [], keys: [] };

    let maxPages = 0;
    tokens.forEach((token) => {
      const len = freq.get(token)?.length || 0;
      if (len > maxPages) maxPages = len;
    });

    const data = [];
    for (let i = 0; i < maxPages; i++) {
      const entry: Record<string, string | number> = { page: (i + 1).toString() };
      tokens.forEach((token) => {
        const counts = freq.get(token) || [];
        entry[token] = counts[i] || 0;
      });
      data.push(entry);
    }

    return { data, keys: tokens };
  }, [freq, tokens]);

  const labelInterval = Math.ceil(chartData.length / 10);
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
            <ResponsiveBarCanvas
              data={chartData}
              keys={keys}
              indexBy="page"
              margin={{ top: 20, right: 110, bottom: 60, left: 60 }}
              pixelRatio={window.devicePixelRatio}
              padding={0.6}
              innerPadding={2}
              enableGridX={true}
              groupMode="grouped"
              colors={{ scheme: 'category10' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              
              // 1. Fix TypeScript error & hide 0 values
              labelFormat={(value) => {
                const val = Number(value); 
                return val > 0 ? val.toString() : ""; 
              }}
              
              // 2. Hide labels if bars are too thin (in pixels)
              labelSkipWidth={16}
              labelSkipHeight={12}

              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Page Number',
                legendPosition: 'middle',
                legendOffset: 36,
                // 1. Force a tick mark for every single data point
                tickValues: chartData.map((d) => d.page), 
                // 2. Conditionally return the label text or an empty string
                format: (value) => {
                  // Assuming 'page' is "1", "2", etc.
                  // Adjust logic if page IDs are not sequential/numeric
                  const index = parseInt(String(value)) - 1;
                  return index % labelInterval === 0 ? value : "";
                }
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Frequency',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
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
                tooltip: {
                  container: {
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                  },
                },
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                  itemTextColor: theme.palette.text.secondary,
                },
              ]}
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
