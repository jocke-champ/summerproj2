import { createClient } from './supabase/client'
import { Project, ShoppingList } from '@/types'

// Projects
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data.map(project => ({
    ...project,
    createdAt: new Date(project.created_at),
    updatedAt: new Date(project.updated_at),
    checklist: typeof project.checklist === 'string' 
      ? JSON.parse(project.checklist) 
      : project.checklist,
    comments: typeof project.comments === 'string' 
      ? JSON.parse(project.comments) 
      : project.comments
  }))
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  const supabase = createClient()
  
  const newProject = {
    title: project.title,
    description: project.description,
    checklist: JSON.stringify(project.checklist),
    comments: JSON.stringify(project.comments),
    progress: project.progress
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([newProject])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return null
  }

  return {
    ...data,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    checklist: JSON.parse(data.checklist),
    comments: JSON.parse(data.comments)
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const supabase = createClient()
  
  const updateData: any = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.progress !== undefined) updateData.progress = updates.progress
  if (updates.checklist !== undefined) updateData.checklist = JSON.stringify(updates.checklist)
  if (updates.comments !== undefined) updateData.comments = JSON.stringify(updates.comments)

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return null
  }

  return {
    ...data,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    checklist: JSON.parse(data.checklist),
    comments: JSON.parse(data.comments)
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    return false
  }

  return true
}

// Shopping Lists
export async function getShoppingLists(): Promise<ShoppingList[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching shopping lists:', error)
    return []
  }

  return data.map(list => ({
    ...list,
    createdAt: new Date(list.created_at),
    updatedAt: new Date(list.updated_at),
    items: typeof list.items === 'string' 
      ? JSON.parse(list.items) 
      : list.items
  }))
}

export async function createShoppingList(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList | null> {
  const supabase = createClient()
  
  const newList = {
    name: list.name,
    items: JSON.stringify(list.items)
  }

  const { data, error } = await supabase
    .from('shopping_lists')
    .insert([newList])
    .select()
    .single()

  if (error) {
    console.error('Error creating shopping list:', error)
    return null
  }

  return {
    ...data,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    items: JSON.parse(data.items)
  }
}

export async function updateShoppingList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList | null> {
  const supabase = createClient()
  
  const updateData: any = {}
  
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.items !== undefined) updateData.items = JSON.stringify(updates.items)

  const { data, error } = await supabase
    .from('shopping_lists')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating shopping list:', error)
    return null
  }

  return {
    ...data,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    items: JSON.parse(data.items)
  }
}

export async function deleteShoppingList(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting shopping list:', error)
    return false
  }

  return true
} 