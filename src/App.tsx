import React, { useState, useEffect, useCallback } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import ActorSelector from './components/ActorSelector';
import DynamicForm from './components/DynamicForm';
import StatusDisplay from './components/StatusDisplay';

// Define the type for an Apify Actor object
interface ApifyActor {
  id: string;
  name?: string;
  title?: string;
  defaultRunOptions?: any;
}

// Define the type for the full Apify Actor Input Schema
interface SchemaProperty {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  title?: string;
  description?: string;
  required?: boolean;
  default?: any;
}

interface ApifyActorSchema {
  title?: string;
  description?: string;
  properties?: { [key: string]: SchemaProperty };
}

// Main App component
const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [actors, setActors] = useState<ApifyActor[]>([]);
  const [selectedActorId, setSelectedActorId] = useState<string>('');
  const [actorSchema, setActorSchema] = useState<ApifyActorSchema | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [runResult, setRunResult] = useState<any[] | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Function to handle fetching actors from the Apify API
  const fetchActors = useCallback(async () => {
    if (!apiKey) {
      setError('Please enter your Apify API key.');
      return;
    }

    setLoading(true);
    setStatusMessage('Fetching actors...');
    setError('');
    setActors([]);
    setSelectedActorId('');
    setActorSchema(null);
    setRunResult(null);

    try {
      const response = await fetch(`https://api.apify.com/v2/acts?token=${apiKey}&limit=1000`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error fetching actors.');
      }

      if (data.data.items.length === 0) {
        setStatusMessage('Authentication successful, but no public actors were found in your account.');
        setActors([]);
      } else {
        setActors(data.data.items);
        setStatusMessage('Actors loaded successfully.');
      }

    } catch (err: any) {
      console.error('API Error in fetchActors:', err);
      setError(`Failed to fetch actors: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  // Function to fetch the input schema for a selected actor
  const fetchActorSchema = useCallback(async () => {
    if (!selectedActorId) return;

    setLoading(true);
    setStatusMessage('Fetching actor schema...');
    setError('');
    setActorSchema(null);
    setRunResult(null);

    try {
      // Use the specific actor's input schema endpoint for a more reliable response
      const response = await fetch(`https://api.apify.com/v2/actors/${selectedActorId}/input-schema?token=${apiKey}`);
      
      // Check for a 404 response gracefully
      if (!response.ok) {
        setStatusMessage('This actor does not have a public input schema or its schema is empty.');
        setActorSchema(null);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error fetching actor schema.');
      }

      // Check for an empty schema, which the API might return if none is defined
      if (Object.keys(data).length === 0) {
        setActorSchema(null);
        setFormData({});
        setStatusMessage('Input schema is empty or not defined for this actor.');
      } else {
        const schema: ApifyActorSchema = data;
        setActorSchema(schema);

        const initialFormData: { [key: string]: any } = {};
        if (schema && schema.properties) {
          Object.keys(schema.properties).forEach(key => {
            const property = schema.properties![key];
            initialFormData[key] = property.default !== undefined ? property.default : '';
          });
        }
        setFormData(initialFormData);

        setStatusMessage('Input schema loaded.');
      }

    } catch (err: any) {
      console.error('API Error in fetchActorSchema:', err);
      setError(`Failed to fetch actor schema: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedActorId, apiKey]);

  // Function to run the selected actor
  const runActor = useCallback(async () => {
    if (!selectedActorId || !apiKey) {
      setError('Please select an actor and provide an API key.');
      return;
    }

    setLoading(true);
    setStatusMessage('Executing actor...');
    setError('');
    setRunResult(null);

    try {
      const runResponse = await fetch(`https://api.apify.com/v2/actors/${selectedActorId}/runs?token=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const runData = await runResponse.json();

      if (runData.error) {
        throw new Error(runData.error.message || 'Error starting actor run.');
      }

      const runId = runData.data.id;
      setStatusMessage(`Actor started with ID: ${runId}. Waiting for results...`);

      const checkRunStatus = async () => {
        const statusResponse = await fetch(`https://api.apify.com/v2/acts/${runData.data.actId}/runs/${runId}?token=${apiKey}`);
        const statusData = await statusResponse.json();
        const status = statusData.data.status;

        if (status === 'SUCCEEDED') {
          setStatusMessage('Run succeeded! Fetching dataset...');
          const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${statusData.data.defaultDatasetId}/items?token=${apiKey}`);
          const datasetItems = await datasetResponse.json();
          setRunResult(datasetItems);
          setStatusMessage('Run complete.');
          setLoading(false);
          return;
        }

        if (status === 'FAILED' || status === 'ABORTED') {
          setError(`Actor run ${status.toLowerCase()}. Check the Apify console for details.`);
          setLoading(false);
          return;
        }

        setTimeout(checkRunStatus, 5000);
      };

      setTimeout(checkRunStatus, 5000);
    } catch (err: any) {
      console.error('API Error in runActor:', err);
      setError(`Failed to run actor: ${err.message}`);
      setLoading(false);
    }
  }, [selectedActorId, apiKey, formData]);

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (apiKey) {
      fetchActors();
    }
  }, [apiKey, fetchActors]);

  useEffect(() => {
    if (selectedActorId) {
      fetchActorSchema();
    }
  }, [selectedActorId, fetchActorSchema]);

  const showForm = actorSchema && actorSchema.properties && Object.keys(actorSchema.properties).length > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 space-y-8 border border-gray-200">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">Apify Actor Runner</h1>
          <p className="text-gray-500 text-lg">Authenticate, select an actor, and run it with dynamic inputs.</p>
        </header>

        <ApiKeyInput
          apiKey={apiKey}
          setApiKey={setApiKey}
          fetchActors={fetchActors}
          loading={loading}
        />

        {actors.length > 0 && (
          <>
            <ActorSelector
              actors={actors}
              selectedActorId={selectedActorId}
              setSelectedActorId={setSelectedActorId}
            />

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Actor Input Form</h3>
              
              {showForm ? (
                <DynamicForm
                  actorSchema={actorSchema!}
                  formData={formData}
                  handleFormChange={handleFormChange}
                  runActor={runActor}
                  loading={loading}
                />
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.393 2.684-1.393 3.449 0l1.293 2.352c.692 1.26.115 2.76-.707 3.449l-1.293 1.293c-.765.765-2.001.765-2.766 0L5.757 8.9c-.822-.689-1.4-2.189-.707-3.449L8.257 3.099zM10 13a1 1 0 100 2 1 1 0 000-2zm-1-3a1 1 0 102 0 1 1 0 00-2 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        This actor has no input schema or its schema is empty. No form fields to display.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {(statusMessage || error || runResult) && (
          <StatusDisplay
            loading={loading}
            statusMessage={statusMessage}
            error={error}
            runResult={runResult}
          />
        )}
      </div>
    </div>
  );
};

export default App;
