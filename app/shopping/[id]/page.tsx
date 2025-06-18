'use client';

import { use, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { updateShoppingList, deleteShoppingList } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { 
  CheckIcon, 
  XIcon, 
  PlusIcon, 
  CalendarIcon,
  TrashIcon,
  EditIcon 
} from 'lucide-react';
import { ShoppingItem, ShoppingCategory } from '@/types';

const categories: ShoppingCategory[] = [
  'Kött & Fisk', 'Mejeri', 'Frukt & Grönt', 'Torrvaror', 'Fryst', 
  'Godis & Snacks', 'Hygien', 'Hushåll', 'Övrigt'
];

interface Props {
  params: Promise<{ id: string }>;
}

export default function ShoppingListDetailPage({ params }: Props) {
  const { id } = use(params);
  const { currentUser, shoppingLists, setShoppingLists } = useApp();
  const router = useRouter();
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory>('Övrigt');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const list = shoppingLists.find(l => l.id === id);

  if (!list) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lista inte hittad</h3>
        <p className="text-gray-600">Listan existerar inte eller har tagits bort.</p>
      </div>
    );
  }

  const addItem = async () => {
    if (!currentUser || !newItem.trim()) return;

    const item: ShoppingItem = {
      id: uuidv4(),
      name: newItem.trim(),
      quantity: newQuantity.trim() || undefined,
      category: selectedCategory,
      completed: false,
      addedBy: currentUser.name,
      createdAt: new Date()
    };

    const updatedList = await updateShoppingList(list.id, {
      items: [...list.items, item]
    });

    if (updatedList) {
      setShoppingLists(prev => prev.map(l => l.id === list.id ? updatedList : l));
      setNewItem('');
      setNewQuantity('');
    }
  };

  const toggleItem = async (itemId: string) => {
    if (!currentUser) return;

    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updatedList = await updateShoppingList(list.id, {
      items: updatedItems
    });

    if (updatedList) {
      setShoppingLists(prev => prev.map(l => l.id === list.id ? updatedList : l));
    }
  };

  const removeItem = async (itemId: string) => {
    if (!currentUser) return;

    const updatedItems = list.items.filter(item => item.id !== itemId);

    const updatedList = await updateShoppingList(list.id, {
      items: updatedItems
    });

    if (updatedList) {
      setShoppingLists(prev => prev.map(l => l.id === list.id ? updatedList : l));
    }
  };

  const handleEdit = async () => {
    if (!editing) {
      setEditName(list.name);
      setEditing(true);
      return;
    }

    if (!editName.trim()) return;

    setLoading(true);
    const updatedList = await updateShoppingList(list.id, {
      name: editName.trim()
    });

    if (updatedList) {
      setShoppingLists(prev => prev.map(l => l.id === list.id ? updatedList : l));
      setEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!currentUser || !confirm('Är du säker på att du vill ta bort denna lista?')) return;

    setLoading(true);
    const success = await deleteShoppingList(list.id);
    
    if (success) {
      setShoppingLists(prev => prev.filter(l => l.id !== list.id));
      router.push('/shopping');
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Du måste välja en användare för att visa inköpslistor.</p>
      </div>
    );
  }

  const completedItems = list.items.filter(item => item.completed).length;
  const totalItems = list.items.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Group items by category
  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category] = list.items.filter(item => item.category === category);
    return acc;
  }, {} as Record<ShoppingCategory, ShoppingItem[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-3xl font-bold w-full bg-transparent border-b-2 border-green-600 focus:outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-3xl font-bold text-green-600">{progress}%</span>
            <button
              onClick={handleEdit}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-green-600 rounded-lg hover:bg-gray-100"
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
            className="bg-green-600 h-4 rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Uppdaterad {format(list.updatedAt, 'PPp', { locale: sv })}</span>
          </div>
          <span>{completedItems}/{totalItems} inhandlat</span>
        </div>
      </div>

      {/* Add new item */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Lägg till vara</h2>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Varunamn..."
          />
          <input
            type="text"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Antal"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ShoppingCategory)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={addItem}
            disabled={!newItem.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Lägg till
          </button>
        </div>
      </div>

      {/* Shopping list by categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => {
          const categoryItems = itemsByCategory[category];
          if (categoryItems.length === 0) return null;

          const completedInCategory = categoryItems.filter(item => item.completed).length;

          return (
            <div key={category} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{category}</h3>
                <span className="text-sm text-gray-500">
                  {completedInCategory}/{categoryItems.length}
                </span>
              </div>

              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        item.completed 
                          ? 'bg-green-600 border-green-600 text-white' 
                          : 'border-gray-300 hover:border-green-600'
                      }`}
                    >
                      {item.completed && <CheckIcon className="w-3 h-3" />}
                    </button>
                    <div className={`flex-1 min-w-0 ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      <div className="font-medium truncate">{item.name}</div>
                      {item.quantity && (
                        <div className="text-xs text-gray-500">{item.quantity}</div>
                      )}
                      <div className="text-xs text-gray-400">av {item.addedBy}</div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 flex-shrink-0"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {totalItems === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Inga varor i listan än. Lägg till den första!</p>
        </div>
      )}
    </div>
  );
} 