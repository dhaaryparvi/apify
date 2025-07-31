import React from 'react';

interface ApifyActor {
  id: string;
  name?: string;
  title?: string;
}

interface ActorSelectorProps {
  actors: ApifyActor[];
  selectedActorId: string;
  setSelectedActorId: (id: string) => void;
}

const ActorSelector: React.FC<ActorSelectorProps> = ({ actors, selectedActorId, setSelectedActorId }) => {
  return (
    <div className="space-y-4">
      <label htmlFor="actor-select" className="block text-lg font-medium text-gray-700">
        Select an Actor
      </label>
      <div className="relative">
        <select
          id="actor-select"
          value={selectedActorId}
          onChange={(e) => setSelectedActorId(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 appearance-none"
        >
          <option value="">-- Choose an actor --</option>
          {actors.map((actor) => (
            <option key={actor.id} value={actor.id}>
              {actor.title || actor.name || actor.id}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ActorSelector;
