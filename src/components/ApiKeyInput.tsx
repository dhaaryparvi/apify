import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  fetchActors: () => void;
  loading: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, fetchActors, loading }) => {
  return (
    <div className="space-y-4">
      <label htmlFor="apiKey" className="block text-lg font-medium text-gray-700">
        Apify API Key
      </label>
      <div className="flex items-center space-x-2">
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-grow rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
          placeholder="Enter your Apify API token"
        />
        <button
          onClick={fetchActors}
          disabled={loading || !apiKey}
          className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition duration-150"
        >
          {loading ? 'Authenticating...' : 'Authenticate & Fetch Actors'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
