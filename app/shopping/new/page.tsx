'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { createShoppingList } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon, XIcon } from 'lucide-react';
import { ShoppingItem, ShoppingCategory } from '@/types';

const categories: ShoppingCategory[] = [
  'Kött & Fisk', 'Mejeri', 'Frukt & Grönt', 'Torrvaror', 'Fryst', 
  'Godis & Snacks', 'Hygien', 'Hushåll', 'Övrigt'
];

const quickAddItems: Record<ShoppingCategory, string[]> = {
  'Kött & Fisk': ['Kyckling', 'Lax', 'Köttfärs', 'Bacon', 'Korv'],
  'Mejeri': ['Mjölk', 'Ägg', 'Smör', 'Ost', 'Yoghurt', 'Grädde'],
  'Frukt & Grönt': ['Bananer', 'Äpplen', 'Gurka', 'Tomater', 'Potatis', 'Lök'],
  'Torrvaror': ['Pasta', 'Ris', 'Bröd', 'Havregryn', 'Linser'],
  'Fryst': ['Frysta bär', 'Fryst kyckling', 'Glass', 'Frysta grönsaker'],
  'Godis & Snacks': ['Chips', 'Choklad', 'Kex', 'Nötter'],
  'Hygien': ['Tandkräm', 'Schampo', 'Tvål', 'Deodorant'],
  'Hushåll': ['Diskmedel', 'Toapapper', 'Pappershanddukar'],
  'Övrigt': ['Batterier', 'Ljus', 'Blommor']
};

export default function NewShoppingListPage() {
  const { currentUser, setShoppingLists } = useApp();
  const router = useRouter();
  const [name, setName] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory>('Övrigt');
  const [loading, setLoading] = useState(false);

  const addItem = (itemName: string, category: ShoppingCategory, quantity?: string) => {
    if (!currentUser || !itemName.trim()) return;

    const item: ShoppingItem = {
      id: uuidv4(),
      name: itemName.trim(),
      quantity: quantity?.trim() || undefined,
      category,
      completed: false,
      addedBy: currentUser.name,
      createdAt: new Date()
    };
    setItems([...items, item]);
  };

  const addCustomItem = () => {
    if (!newItem.trim()) return;
    addItem(newItem, selectedCategory, newQuantity);
    setNewItem('');
    setNewQuantity('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim()) return;

    setLoading(true);
    try {
      const newList = await createShoppingList({
        name: name.trim(),
        items
      });

      if (newList) {
        setShoppingLists(prev => [newList, ...prev]);
        router.push(`/shopping/${newList.id}`);
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Du måste välja en användare för att skapa inköpslistor.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Skapa ny inköpslista</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Listnamn *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="T.ex. Veckohandling"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lägg till varor
          </label>
          
          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Varunamn..."
              />
              <input
                type="text"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem())}
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
                type="button"
                onClick={addCustomItem}
                disabled={!newItem.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {categories.map(category => (
              <div key={category} className="border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">{category}</h4>
                <div className="space-y-1">
                  {quickAddItems[category].map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => addItem(item, category)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-left w-full"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Tillagda varor ({items.length}):</h4>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1">
                    {item.name} {item.quantity && `(${item.quantity})`} - {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Skapar...' : 'Skapa lista'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
} 