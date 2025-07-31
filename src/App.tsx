import React, { useState, useEffect, useCallback } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import ActorSelector from './components/ActorSelector';
import DynamicForm from './components/DynamicForm';
import StatusDisplay from './components/StatusDisplay';

// Define the type for an Apify Actor object
interface ApifyActor {
  id: string;
  name?: string;
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
      
      console.log('API Response for fetching actors:', data); // Log the full response

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
      // CORRECTED URL: Now using /v2/acts endpoint
      const response = await fetch(`https://api.apify.com/v2/acts/${selectedActorId}?token=${apiKey}`);
      const data = await response.json();
      
      console.log('API Response for fetching schema:', data); // Log the full response

      if (data.error) {
        throw new Error(data.error.message || 'Error fetching actor schema.');
      }

      const schema = data.data.inputSchema;
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
      
      console.log('API Response for running actor:', runData); // Log the full response

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

            {actorSchema && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                <DynamicForm
                  actorSchema={actorSchema}
                  formData={formData}
                  handleFormChange={handleFormChange}
                  runActor={runActor}
                  loading={loading}
                />
              </div>
            )}
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
