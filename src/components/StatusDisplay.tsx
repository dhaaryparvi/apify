import React from 'react';

interface StatusDisplayProps {
  loading: boolean;
  statusMessage: string;
  error: string;
  runResult: any[] | null;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ loading, statusMessage, error, runResult }) => {
  if (!statusMessage && !error && !runResult) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Status</h3>
      {loading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg">{statusMessage}</span>
        </div>
      )}
      {!loading && statusMessage && <p className="text-lg text-gray-700">{statusMessage}</p>}
      {error && <p className="text-lg text-red-600 mt-2">{error}</p>}
      
      {runResult && (
        <div id="results" className="mt-4 space-y-2 text-sm text-gray-800">
          <h4 className="font-bold">Results:</h4>
          {runResult.length > 0 ? (
            runResult.map((item, index) => (
              <pre key={index} className="bg-gray-200 p-2 rounded-md overflow-x-auto">
                {JSON.stringify(item, null, 2)}
              </pre>
            ))
          ) : (
            <p>No results found in the dataset.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusDisplay;
