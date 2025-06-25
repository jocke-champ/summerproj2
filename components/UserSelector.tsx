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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>Inloggad som <strong>{currentUser.name}</strong></span>
        </div>
        <button 
          onClick={() => setShowSelector(true)}
          className="text-blue-600 hover:text-blue-800 underline self-start sm:self-auto"
        >
          Byt användare
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Vem är du?</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {familyMembers.map((name) => (
          <button
            key={name}
            onClick={() => selectUser(name)}
            className="p-3 text-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg border border-blue-200 transition-colors font-medium min-h-[48px] flex items-center justify-center"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Eller skriv ditt namn..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomUser()}
            className="flex-1 px-3 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCustomUser}
            disabled={!customName.trim()}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium min-h-[48px]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
} 