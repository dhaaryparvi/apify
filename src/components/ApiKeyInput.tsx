import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  fetchActors: () => void;
  loading: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, fetchActors, loading }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Apify API Key</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="password"
          id="apiKeyInput"
          placeholder="Enter your Apify API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-grow w-full sm:w-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <button
          onClick={fetchActors}
          disabled={loading || !apiKey}
          className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Authenticating...' : 'Authenticate & Fetch Actors'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
