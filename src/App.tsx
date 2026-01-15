import { useState } from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './App.css'
import { GlobalWordRanking } from './GlobalRanking';
import { runPdfAnalysisInWorker } from './pdfClient';
import type { Frequencies } from './types';

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

function SelectFileBtn({ onFileSelect, label = 'Select PDF File'}: SelectFileBtnProps) {

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

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>PDF Analysis</Typography>
      
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
      
      {isProcessing && <p>Processing...</p>}

      {freq && (
        <>
          <div>
            Unique Tokens: {freq.size}
            <br />
            Analyzed Tokens: {Array.from(freq.values()).map(x => x.reduce((p, c) => p+c)).reduce((p, c) => p+c)} 
          </div>
          <GlobalWordRanking freq={freq} limit={35} />
        </>
      )}
    </div>
  );
}

export default App
