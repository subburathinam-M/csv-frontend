import React from 'react';
import { Download, FileSpreadsheet, Archive } from 'lucide-react';

const FileDownloads = ({ files, rawZipBlob }) => {
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    files.forEach((file, index) => {
      setTimeout(() => handleDownload(file), index * 300); // slight stagger for multi-download
    });
  };

  const handleDownloadZip = () => {
    if (rawZipBlob) {
      const url = URL.createObjectURL(rawZipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed_output.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="glass-panel downloads-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2><FileSpreadsheet /> Filtered Excel Files</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {rawZipBlob && (
            <button 
               onClick={handleDownloadZip}
               style={{
                 background: 'rgba(255,255,255,0.05)',
                 color: 'white',
                 padding: '0.6rem 1.2rem',
                 borderRadius: '8px',
                 fontWeight: '600',
                 border: '1px solid rgba(255,255,255,0.1)',
                 transition: 'all 0.2s',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.4rem',
                 cursor: 'pointer'
               }}
               onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
               onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <Archive size={18} /> Download ZIP
            </button>
          )}
          <button 
             onClick={handleDownloadAll}
             style={{
             background: 'var(--primary)',
             color: 'white',
             padding: '0.6rem 1.2rem',
             borderRadius: '8px',
             fontWeight: '600',
             transition: 'all 0.2s',
           }}
           onMouseOver={e => e.currentTarget.style.background = 'var(--primary-hover)'}
           onMouseOut={e => e.currentTarget.style.background = 'var(--primary)'}
        >
          Download All
        </button>
        </div>
      </div>

      <div className="download-grid" style={{ marginTop: '1.5rem' }}>
        {files.map((file, idx) => (
          <div key={idx} className="download-card">
            <div className="download-info">
              <h4>{file.name}</h4>
              <p>{file.desc}</p>
            </div>
            <button 
              className="download-btn"
              onClick={() => handleDownload(file)}
              title={`Download ${file.name}`}
            >
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDownloads;
