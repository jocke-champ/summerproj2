'use client';

import { use, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { updateProject, deleteProject } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { 
  CheckIcon, 
  XIcon, 
  PlusIcon, 
  MessageSquareIcon, 
  CalendarIcon,
  TrashIcon,
  EditIcon 
} from 'lucide-react';
import { ChecklistItem, Comment } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { id } = use(params);
  const { currentUser, projects, setProjects } = useApp();
  const router = useRouter();
  const [newItem, setNewItem] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Projekt inte hittat</h3>
        <p className="text-gray-600">Projektet existerar inte eller har tagits bort.</p>
      </div>
    );
  }

  const addChecklistItem = async () => {
    if (!currentUser || !newItem.trim()) return;

    const item: ChecklistItem = {
      id: uuidv4(),
      text: newItem.trim(),
      completed: false,
      createdAt: new Date()
    };

    const updatedProject = await updateProject(project.id, {
      checklist: [...project.checklist, item]
    });

    if (updatedProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      setNewItem('');
    }
  };

  const toggleChecklistItem = async (itemId: string) => {
    if (!currentUser) return;

    const updatedChecklist = project.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = updatedChecklist.length > 0 ? Math.round((completedCount / updatedChecklist.length) * 100) : 0;

    const updatedProject = await updateProject(project.id, {
      checklist: updatedChecklist,
      progress
    });

    if (updatedProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    }
  };

  const removeChecklistItem = async (itemId: string) => {
    if (!currentUser) return;

    const updatedChecklist = project.checklist.filter(item => item.id !== itemId);
    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = updatedChecklist.length > 0 ? Math.round((completedCount / updatedChecklist.length) * 100) : 0;

    const updatedProject = await updateProject(project.id, {
      checklist: updatedChecklist,
      progress
    });

    if (updatedProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    }
  };

  const addComment = async () => {
    if (!currentUser || !newComment.trim()) return;

    const comment: Comment = {
      id: uuidv4(),
      author: currentUser.name,
      text: newComment.trim(),
      createdAt: new Date()
    };

    const updatedProject = await updateProject(project.id, {
      comments: [...project.comments, comment]
    });

    if (updatedProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      setNewComment('');
    }
  };

  const handleEdit = async () => {
    if (!editing) {
      setEditTitle(project.title);
      setEditDescription(project.description);
      setEditing(true);
      return;
    }

    if (!editTitle.trim()) return;

    setLoading(true);
    const updatedProject = await updateProject(project.id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    });

    if (updatedProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      setEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!currentUser || !confirm('Är du säker på att du vill ta bort detta projekt?')) return;

    setLoading(true);
    const success = await deleteProject(project.id);
    
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
      router.push('/projects');
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Du måste välja en användare för att visa projekt.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-3xl font-bold w-full bg-transparent border-b-2 border-blue-600 focus:outline-none"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full text-gray-600 bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <p className="text-gray-600">{project.description}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-3xl font-bold text-blue-600">{project.progress}%</span>
            <button
              onClick={handleEdit}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
            >
              {editing ? <CheckIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all" 
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Uppdaterad {format(project.updatedAt, 'PPp', { locale: sv })}</span>
          </div>
          <span>{project.checklist.filter(item => item.completed).length}/{project.checklist.length} uppgifter klara</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Checklista</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Lägg till uppgift..."
          />
          <button
            onClick={addChecklistItem}
            disabled={!newItem.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Lägg till
          </button>
        </div>

        <div className="space-y-2">
          {project.checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  item.completed 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 hover:border-green-600'
                }`}
              >
                {item.completed && <CheckIcon className="w-3 h-3" />}
              </button>
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {item.text}
              </span>
              <button
                onClick={() => removeChecklistItem(item.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          {project.checklist.length === 0 && (
            <p className="text-gray-500 text-center py-4">Inga uppgifter än. Lägg till den första!</p>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquareIcon className="w-5 h-5" />
          Kommentarer ({project.comments.length})
        </h2>

        <div className="flex gap-3 mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Skriv en kommentar..."
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 self-start"
          >
            Kommentera
          </button>
        </div>

        <div className="space-y-4">
          {project.comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-400 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {format(comment.createdAt, 'PPp', { locale: sv })}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
          {project.comments.length === 0 && (
            <p className="text-gray-500 text-center py-4">Inga kommentarer än. Var första att kommentera!</p>
          )}
        </div>
      </div>
    </div>
  );
} 