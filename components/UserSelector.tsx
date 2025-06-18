'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User } from '@/types';
import { UserIcon } from 'lucide-react';

const familyMembers = [
  'Joakim', 'Jan', 'Eva', 'Hanna', 'Gustav'
];

export default function UserSelector() {
  const { currentUser, setCurrentUser } = useApp();
  const [showSelector, setShowSelector] = useState(!currentUser);
  const [customName, setCustomName] = useState('');

  const selectUser = (name: string) => {
    const user: User = { name };
    setCurrentUser(user);
    setShowSelector(false);
  };

  const addCustomUser = () => {
    if (customName.trim()) {
      selectUser(customName.trim());
      setCustomName('');
    }
  };

  if (!showSelector && currentUser) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <UserIcon className="w-4 h-4" />
        <span>Inloggad som <strong>{currentUser.name}</strong></span>
        <button 
          onClick={() => setShowSelector(true)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Byt användare
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Vem är du?</h2>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {familyMembers.map((name) => (
          <button
            key={name}
            onClick={() => selectUser(name)}
            className="p-3 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Eller skriv ditt namn..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomUser()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCustomUser}
            disabled={!customName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
} 