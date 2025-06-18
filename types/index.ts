export interface User {
  name: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
  progress: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  category: string;
  completed: boolean;
  addedBy: string;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ShoppingCategory = 
  | 'Kött & Fisk' 
  | 'Mejeri' 
  | 'Frukt & Grönt' 
  | 'Torrvaror' 
  | 'Fryst' 
  | 'Godis & Snacks' 
  | 'Hygien' 
  | 'Hushåll' 
  | 'Övrigt'; 