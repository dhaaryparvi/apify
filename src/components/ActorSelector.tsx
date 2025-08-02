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
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Select an Actor</h3>
      <select
        id="actorSelect"
        value={selectedActorId}
        onChange={(e) => setSelectedActorId(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        {actors.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name || actor.title || actor.id}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ActorSelector;
