import React from 'react';

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

interface DynamicFormProps {
  actorSchema: ApifyActorSchema;
  formData: { [key: string]: any };
  handleFormChange: (e: React.ChangeEvent<any>) => void;
  runActor: () => void;
  loading: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  actorSchema,
  formData,
  handleFormChange,
  runActor,
  loading,
}) => {
  return (
    <>
      <div className="space-y-4">
        {Object.keys(actorSchema.properties || {}).map((key) => {
          const property = actorSchema.properties![key];
          
          let inputElement;
          const commonClasses = 'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';

          switch (property.type) {
            case 'integer':
            case 'number':
              inputElement = (
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleFormChange}
                  placeholder={property.description}
                  className={commonClasses}
                />
              );
              break;
            case 'boolean':
              inputElement = (
                <input
                  type="checkbox"
                  id={key}
                  name={key}
                  checked={formData[key] || false}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              );
              break;
            case 'array':
            case 'object':
              inputElement = (
                <textarea
                  id={key}
                  name={key}
                  rows={4}
                  value={formData[key] ? JSON.stringify(formData[key], null, 2) : ''}
                  onChange={(e) => {
                    try {
                      handleFormChange({
                        ...e,
                        target: { ...e.target, value: JSON.parse(e.target.value) },
                      });
                    } catch (err) {
                      // Handle invalid JSON, let the user continue typing
                    }
                  }}
                  placeholder={property.description}
                  className={commonClasses}
                />
              );
              break;
            case 'string':
            default:
              inputElement = (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleFormChange}
                  placeholder={property.description}
                  className={commonClasses}
                />
              );
              break;
          }
          
          return (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                {property.title || key}
              </label>
              {inputElement}
            </div>
          );
        })}
      </div>
      <button
        onClick={runActor}
        disabled={loading}
        className="w-full mt-6 px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform duration-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Executing...' : 'Run Actor'}
      </button>
    </>
  );
};

export default DynamicForm;
