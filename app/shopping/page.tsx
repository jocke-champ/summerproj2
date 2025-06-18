'use client';

import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { PlusIcon, CalendarIcon, ShoppingCartIcon } from 'lucide-react';

export default function ShoppingPage() {
  const { shoppingLists } = useApp();

  const sortedLists = [...shoppingLists].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Inköpslistor</h1>
        <Link 
          href="/shopping/new" 
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <PlusIcon className="w-4 h-4" />
          Ny lista
        </Link>
      </div>

      {sortedLists.length > 0 ? (
        <div className="grid gap-6">
          {sortedLists.map((list) => {
            const completedItems = list.items.filter(item => item.completed).length;
            const totalItems = list.items.length;
            const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            return (
              <Link key={list.id} href={`/shopping/${list.id}`}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">{list.name}</h2>
                    <span className="text-2xl font-bold text-green-600">{progress}%</span>
                  </div>
                  
                  <div className="bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Uppdaterad {format(list.updatedAt, 'PP', { locale: sv })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>{totalItems} varor</span>
                      </div>
                    </div>
                    <span>{completedItems}/{totalItems} inhandlat</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga inköpslistor än</h3>
          <p className="text-gray-600 mb-6">Kom igång genom att skapa din första inköpslista!</p>
          <Link 
            href="/shopping/new" 
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            <PlusIcon className="w-5 h-5" />
            Skapa lista
          </Link>
        </div>
      )}
    </div>
  );
} 