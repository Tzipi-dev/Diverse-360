import React, { useState } from 'react';

const Demo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [downloadPath, setDownloadPath] = useState<string>('');
  const [deletePath, setDeletePath] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    // מקודד שם הקובץ למניעת תקלות בעברית/תווים מיוחדים
    const encodedFileName = encodeURIComponent(file.name);
    const renamedFile = new File([file], encodedFileName, { type: file.type });

    const formData = new FormData();
    formData.append('file', renamedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/files`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`File uploaded! Path: ${result.data.path}`);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage('Upload failed.');
    }
  };

  const handleDelete = async () => {
    if (!deletePath) {
      setMessage('Please enter a file path to delete.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/files/${deletePath}`, {
        method: 'DELETE',
      });


      const result = await response.json();

      if (response.ok) {
        setMessage(`File deleted!`);
      } else {
        setMessage(`Delete Error: ${result.message}`);
      }
    } catch (error) {
      setMessage('Delete failed.');
    }
  };

  const handleDownload = async () => {
    if (!downloadPath) {
      setMessage('Please enter a file path to download.');
      return;
    }

   try {
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/files/${downloadPath}`, {
    method: 'GET',
  });


      if (!response.ok) {
        setMessage('Download failed.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURIComponent(downloadPath);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage('File downloaded successfully!');
    } catch (error) {
      setMessage('Download failed.');
    }
  };

  return (
    <div>
      <h2>File Manager</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>

      <h3>Delete File</h3>
      <input
        type="text"
        placeholder="Enter file path"
        value={deletePath}
        onChange={(e) => setDeletePath(e.target.value)}
      />
      <button onClick={handleDelete}>Delete File</button>

      <h3>Download File</h3>
      <input
        type="text"
        placeholder="Enter file path"
        value={downloadPath}
        onChange={(e) => setDownloadPath(e.target.value)}
      />
      <button onClick={handleDownload}>Download File</button>

      <p>{message}</p>
    </div>
  );
};

export default Demo;
