import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'framer-motion';
import DropZoneArea from './components/DropZoneArea';
import StatsDashboard from './components/StatsDashboard';
import FileDownloads from './components/FileDownloads';
import Header from './components/Header';
import { AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [rawZipBlob, setRawZipBlob] = useState(null);

  const handleFileDrop = async (acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setError(null);
      await processCsv(selected);
    } else {
      setError('Please upload a valid .csv file');
    }
  };

  const processCsv = async (csvFile) => {
    setIsProcessing(true);
    setStats(null);
    setProcessedFiles([]);
    setRawZipBlob(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      // Create request to backend
      const response = await axios.post('https://csv-backend-55nw.onrender.com/api/v1/csv/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer', // Important to get ZIP file correctly
      });

      // Extract stats from headers
      const totalRows = response.headers['x-total-rows'] || response.headers['X-Total-Rows'];
      const dupRows = response.headers['x-duplicate-rows'] || response.headers['X-Duplicate-Rows'];
      const uniqueRows = response.headers['x-unique-rows'] || response.headers['X-Unique-Rows'];

      setStats({
        total: parseInt(totalRows || '0'),
        duplicates: parseInt(dupRows || '0'),
        unique: parseInt(uniqueRows || '0'),
      });

      // Save raw zip for separate download
      const zipBlob = new Blob([response.data], { type: 'application/zip' });
      setRawZipBlob(zipBlob);

      // Process ZIP response
      const zip = new JSZip();
      const content = await zip.loadAsync(response.data);
      
      const filesExtracted = [];
      
      // Extract each file
      for (const [filename, zipEntry] of Object.entries(content.files)) {
        if (!zipEntry.dir) {
          const blob = await zipEntry.async('blob');
          filesExtracted.push({
            name: filename,
            blob: blob,
            url: URL.createObjectURL(blob),
            // add some nice descriptions based on filename
            desc: filename.includes('grouped') ? 'Duplicates grouped in a single column' : 
                  filename.includes('unique') ? 'Only the unique rows' : 'All duplicate rows'
          });
        }
      }

      setProcessedFiles(filesExtracted);

    } catch (err) {
      console.error(err);
      setError('Processing failed. Please make sure the backend is running and the CSV is valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isProcessing && !stats && (
          <DropZoneArea onDrop={handleFileDrop} />
        )}
        
        {isProcessing && (
          <div className="loading-container">
            <div className="spinner"></div>
            <h3>Processing your CSV...</h3>
            <p className="dropzone-subtitle">Finding duplicates and unique records</p>
          </div>
        )}

        {error && (
          <div className="error-message mx-4 mb-4">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {stats && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsDashboard stats={stats} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {processedFiles.length > 0 && !isProcessing && (
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.2 }}
           >
             <FileDownloads files={processedFiles} rawZipBlob={rawZipBlob} />
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
