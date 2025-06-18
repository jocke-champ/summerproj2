'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { PlusIcon, CalendarIcon, MessageSquareIcon } from 'lucide-react';

export default function ProjectsPage() {
  const { projects } = useApp();
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'title'>('date');

  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projekt</h1>
        <Link 
          href="/projects/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Nytt projekt
        </Link>
      </div>

      {projects.length > 0 && (
        <div className="flex gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Sortera efter:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="date">Senast uppdaterad</option>
            <option value="progress">Framsteg</option>
            <option value="title">Titel</option>
          </select>
        </div>
      )}

      {sortedProjects.length > 0 ? (
        <div className="grid gap-6">
          {sortedProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
                  <span className="text-2xl font-bold text-blue-600">{project.progress}%</span>
                </div>
                
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Uppdaterad {format(project.updatedAt, 'PP', { locale: sv })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquareIcon className="w-4 h-4" />
                      <span>{project.comments.length} kommentarer</span>
                    </div>
                  </div>
                  <span>{project.checklist.filter(item => item.completed).length}/{project.checklist.length} uppgifter</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga projekt än</h3>
          <p className="text-gray-600 mb-6">Kom igång genom att skapa ditt första projekt!</p>
          <Link 
            href="/projects/new" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Skapa projekt
          </Link>
        </div>
      )}
    </div>
  );
} 