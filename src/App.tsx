import { useDeferredValue, useState } from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TopTokens } from './TopTokens.tsx';
import { runPdfAnalysisInWorker } from './pdfClient';
import type { Frequencies } from './types';
import { TokenFreqOverPages } from './TokenFreqOverPages';
import { TokenSelector } from './TokenSelector.tsx';
import './App.css';
import { Stack, Box } from '@mui/material';
import { TopLongestTokens } from './LongestTokens.tsx';

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
  const deferedSelectedTokens = useDeferredValue<string[]>(selectedTokens);

  return (
    <div style={{ padding: '2rem' }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" gutterBottom>Frequency Analysis</Typography>
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
      <br />
      <br />
      
      {isProcessing && <p>Processing...</p>}

      {freq && (
        <>
          <TopTokens freq={freq} limit={50} />
          <br />
          <br />
          <Stack direction='column' alignItems='center' justifyContent='center' spacing={2}>
            <TokenFreqOverPages freq={freq} tokens={deferedSelectedTokens} />
            <Box maxWidth='90%'>
              <TokenSelector 
                selection={selectedTokens} 
                tokens={Array.from(freq.keys())} 
                setTokens={setSelectedTokens} 
              />
            </Box>
          </Stack>
          <br />
          <br />
          <br />
          <br />
          <br />
          <TopLongestTokens freq={freq} limit={20} />
        </>
      )}
    </div>
  );
}

export default App
