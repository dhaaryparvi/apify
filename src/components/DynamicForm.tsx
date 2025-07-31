// import React from 'react';

// // Define the type for the full Apify Actor Input Schema
// interface SchemaProperty {
//   type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
//   title?: string;
//   description?: string;
//   required?: boolean;
//   default?: any;
// }

// interface ApifyActorSchema {
//   title?: string;
//   description?: string;
//   properties?: { [key: string]: SchemaProperty };
// }

// interface DynamicFormProps {
//   actorSchema: ApifyActorSchema;
//   formData: { [key: string]: any };
//   handleFormChange: (e: React.ChangeEvent<any>) => void;
//   runActor: () => void;
//   loading: boolean;
// }

// const DynamicForm: React.FC<DynamicFormProps> = ({
//   actorSchema,
//   formData,
//   handleFormChange,
//   runActor,
//   loading,
// }) => {
//   // A console log to confirm that this component is actually rendering
//   console.log('DynamicForm is rendering!');

//   const renderInput = (key: string, property: SchemaProperty) => {
//     switch (property.type) {
//       case 'string':
//         return (
//           <input
//             type="text"
//             id={key}
//             name={key}
//             value={formData[key]}
//             onChange={handleFormChange}
//             className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
//             placeholder={property.title || key}
//           />
//         );
//       case 'number':
//       case 'integer':
//         return (
//           <input
//             type="number"
//             id={key}
//             name={key}
//             value={formData[key]}
//             onChange={handleFormChange}
//             className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
//             placeholder={property.title || key}
//           />
//         );
//       case 'boolean':
//         return (
//           <input
//             type="checkbox"
//             id={key}
//             name={key}
//             checked={formData[key]}
//             onChange={handleFormChange}
//             className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition duration-150"
//           />
//         );
//       default:
//         return (
//           <textarea
//             id={key}
//             name={key}
//             value={formData[key]}
//             onChange={handleFormChange}
//             rows={4}
//             className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
//             placeholder={`Enter JSON for ${property.title || key}`}
//           />
//         );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h3 className="text-2xl font-bold text-gray-800">Actor Input Form</h3>
//       <p className="text-gray-500">
//         {actorSchema.description || 'Fill out the form to configure the actor run.'}
//       </p>
      
//       {actorSchema.properties &&
//         Object.keys(actorSchema.properties).map((key) => {
//           const property = actorSchema.properties![key];
//           return (
//             <div key={key} className="space-y-2">
//               <label htmlFor={key} className="block text-sm font-medium text-gray-700">
//                 {property.title || key} {property.required && <span className="text-red-500">*</span>}
//               </label>
//               {renderInput(key, property)}
//               {property.description && (
//                 <p className="text-sm text-gray-400">{property.description}</p>
//               )}
//             </div>
//           );
//         })}

//       <button
//         onClick={runActor}
//         disabled={loading}
//         className="w-full rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition duration-150"
//       >
//         {loading ? 'Running...' : 'Run Actor'}
//       </button>
//     </div>
//   );
// };

// export default DynamicForm;


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

interface Props {
  actorSchema: ApifyActorSchema;
  formData: { [key: string]: any };
  handleFormChange: (e: React.ChangeEvent<any>) => void;
  runActor: () => void;
  loading: boolean;
}

const DynamicForm: React.FC<Props> = ({ actorSchema, formData, handleFormChange, runActor, loading }) => {
  const renderInput = (key: string, property: SchemaProperty) => {
    const value = formData[key] ?? '';

    switch (property.type) {
      case 'string':
      case 'number':
      case 'integer':
        return (
          <input
            name={key}
            type={property.type === 'string' ? 'text' : 'number'}
            value={value}
            onChange={handleFormChange}
            className="w-full p-2 border rounded-md"
          />
        );

      case 'boolean':
        return (
          <input
            name={key}
            type="checkbox"
            checked={!!value}
            onChange={handleFormChange}
            className="h-5 w-5"
          />
        );

      default:
        return <p className="text-red-500">Unsupported type: {property.type}</p>;
    }
  };

  if (!actorSchema.properties) return <p>No input schema found.</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        runActor();
      }}
      className="space-y-6"
    >
      {Object.entries(actorSchema.properties).map(([key, property]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {property.title || key}
          </label>
          {renderInput(key, property)}
          {property.description && (
            <p className="text-xs text-gray-500 mt-1">{property.description}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run Actor'}
      </button>
    </form>
  );
};

export default DynamicForm;

