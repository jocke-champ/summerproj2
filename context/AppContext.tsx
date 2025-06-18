'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ShoppingList, User } from '@/types';
import { getProjects, getShoppingLists } from '@/lib/database';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  shoppingLists: ShoppingList[];
  setShoppingLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database and localStorage for user
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Load user from localStorage (still use localStorage for user selection)
      const savedUser = localStorage.getItem('grasos-user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      // Load projects and shopping lists from Supabase
      const [projectsData, shoppingListsData] = await Promise.all([
        getProjects(),
        getShoppingLists()
      ]);

      setProjects(projectsData);
      setShoppingLists(shoppingListsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage if Supabase fails
      try {
        const savedProjects = localStorage.getItem('grasos-projects');
        const savedShoppingLists = localStorage.getItem('grasos-shopping-lists');
        
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        }
        if (savedShoppingLists) {
          setShoppingLists(JSON.parse(savedShoppingLists));
        }
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('grasos-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('grasos-user');
    }
  }, [currentUser]);

  // Backup to localStorage for offline functionality
  useEffect(() => {
    localStorage.setItem('grasos-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('grasos-shopping-lists', JSON.stringify(shoppingLists));
  }, [shoppingLists]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      projects,
      setProjects,
      shoppingLists,
      setShoppingLists,
      isLoading,
      refreshData: loadData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 