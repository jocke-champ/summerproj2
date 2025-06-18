'use client';

import { useApp } from '@/context/AppContext';
import UserSelector from '@/components/UserSelector';
import Link from 'next/link';
import { ClipboardListIcon, ShoppingCartIcon, PlusIcon } from 'lucide-react';

export default function HomePage() {
  const { currentUser, projects, shoppingLists } = useApp();

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <UserSelector />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Välkommen, {currentUser.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Hantera familjens projekt och inköpslistor
          </p>
        </div>
        <UserSelector />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardListIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Projekt</h2>
          </div>
          
          {projects.length > 0 ? (
            <div className="space-y-3 mb-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="border-l-4 border-blue-400 pl-4 py-2">
                  <h3 className="font-medium">{project.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="bg-gray-200 rounded-full h-2 flex-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))}
              {projects.length > 3 && (
                <p className="text-sm text-gray-500">
                  ... och {projects.length - 3} till
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">Inga projekt än</p>
          )}

          <div className="flex gap-2">
            <Link 
              href="/projects" 
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
            >
              Visa alla projekt
            </Link>
            <Link 
              href="/projects/new" 
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              <PlusIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Shopping Lists Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCartIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">Inköpslistor</h2>
          </div>
          
          {shoppingLists.length > 0 ? (
            <div className="space-y-3 mb-4">
              {shoppingLists.slice(0, 3).map((list) => (
                <div key={list.id} className="border-l-4 border-green-400 pl-4 py-2">
                  <h3 className="font-medium">{list.name}</h3>
                  <p className="text-sm text-gray-600">
                    {list.items.length} varor
                    {list.items.filter(item => !item.completed).length > 0 && 
                      ` (${list.items.filter(item => !item.completed).length} kvar)`
                    }
                  </p>
                </div>
              ))}
              {shoppingLists.length > 3 && (
                <p className="text-sm text-gray-500">
                  ... och {shoppingLists.length - 3} till
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">Inga inköpslistor än</p>
          )}

          <div className="flex gap-2">
            <Link 
              href="/shopping" 
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center"
            >
              Visa alla listor
            </Link>
            <Link 
              href="/shopping/new" 
              className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
            >
              <PlusIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
