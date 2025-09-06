import React from 'react';

export const EnvTest: React.FC = () => {
  const viteKey = import.meta.env?.VITE_GEMINI_API_KEY;
  
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3>Environment Test</h3>
      <p>VITE_GEMINI_API_KEY: {viteKey ? 'Present' : 'Missing'}</p>
      <p>Length: {viteKey?.length || 0}</p>
      <p>First 10 chars: {viteKey?.substring(0, 10) || 'N/A'}</p>
    </div>
  );
};
