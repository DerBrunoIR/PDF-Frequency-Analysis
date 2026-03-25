import { useDeferredValue, useState, useEffect } from 'react'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TopTokens } from './TopTokens.tsx';
import { runPdfAnalysisInWorker } from './pdfClient';
import type { Frequencies } from './types';
import { TokenFreqOverPages } from './TokenFreqOverPages';
import { TokenSelector } from './TokenSelector.tsx';
import './App.css';
import { Stack, Box, IconButton } from '@mui/material';
import { TopLongestTokens } from './LongestTokens.tsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface SelectFileBtnProps {
  label?: string,
  onFileSelect: (file: File) => void,
}

function SelectFileBtn({ onFileSelect, label = 'Select PDF'}: SelectFileBtnProps) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset value to allow selecting the same file again if needed
    event.target.value = ''; 
  };

  return (
    <Button
      component="label"
      color='primary'
      role={undefined}
      variant="contained"
      tabIndex={-1}
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        accept='application/pdf'
        onChange={(event) => handleChange(event) }
        multiple
      />
    </Button>
  );
}

function App() {
  const [freq, setFreq] = useState<Frequencies | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const deferedSelectedTokens = useDeferredValue<string[]>(selectedTokens);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const link = document.getElementById('prime-theme');
    if (link) {
      link.setAttribute('href', 
        `https://primereact.org/resources/themes/lara-${darkMode ? 'dark' : 'light'}-blue/theme.css`
      );
    }
    document.body.style.backgroundColor = darkMode ? '#000000' : '#f8f9fa';
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
    <div style={{ padding: '2rem' }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>Frequency Analysis</Typography>
        <Stack direction='row' alignItems='center' spacing={1}>
            <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: darkMode ? 'white' : 'black' }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <SelectFileBtn
            onFileSelect={async (file) => {
            setIsProcessing(true);
            try {
              // Non-blocking call
              const result = await runPdfAnalysisInWorker(file);
              setFreq(result);
            } catch (e) {
              console.error(e);
            } finally {
              setIsProcessing(false);
            }
          }}
        />
      </Stack>
      </Stack>
      <Box sx={{ height: 20 }} />
      
      {isProcessing && <p>Processing...</p>}

      {(freq && !isProcessing) && (
        <>
          <TopTokens freq={freq} limit={50} />
          <Box sx={{ height: 20 }} />
          <Stack direction='column' alignItems='center' justifyContent='center' spacing={2}>
            <TokenFreqOverPages freq={freq} tokens={deferedSelectedTokens} />
            <Box maxWidth='90%'>
              <TokenSelector 
                selection={selectedTokens} 
                tokens={Array.from(freq.keys())} 
                setTokens={setSelectedTokens} 
              />
      <Stack direction='row' justifyContent='space-between' alignItems='center' flexWrap="wrap" gap={1}>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  *interpreted as regex: .*+?^${}()|[\]
                </Typography>
                {selectedTokens.length > 0 && (
                  <Typography 
                    variant="caption" 
                    color="primary" 
                    sx={{ mt: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => setSelectedTokens([])}
                  >
                    Clear all
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
          <Box sx={{ height: 50 }} />
          <TopLongestTokens freq={freq} limit={20} />
        </>
      )}
    </div>
    </ThemeProvider>
  );
}

export default App
