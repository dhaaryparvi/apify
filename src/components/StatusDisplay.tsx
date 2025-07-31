import React from 'react';

// Component for displaying status messages, errors, and results
const StatusDisplay: React.FC<{ loading: boolean; statusMessage: string; error: string; runResult: any[] | null }> = ({ loading, statusMessage, error, runResult }) => {
  return (
    <div className="space-y-4">
      {statusMessage && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 00-2 0v4a1 1 0 102 0v-4zm2 2a1 1 0 10-2 0v2a1 1 0 102 0v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">{statusMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {runResult && runResult.length > 0 && (
        <div className="rounded-md bg-green-50 p-4">
          <h3 className="text-sm font-medium text-green-800">Actor run succeeded!</h3>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded-md bg-green-100 p-3 text-sm text-green-800">
            {JSON.stringify(runResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default StatusDisplay;
