import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { Task, Project } from '../types';

export class DatabaseService {
  private db!: Database.Database; // Use definite assignment assertion
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'taskflow.db');
  }

  initialize(): void {
    // Ensure the directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.createTables();
    this.insertDefaultData();
  }

  private createTables(): void {
    // Projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT DEFAULT '#3b82f6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        project_id INTEGER,
        priority INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        due_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        parent_task_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // Tags table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT DEFAULT '#6b7280'
      )
    `);

    // Task-Tag relationships
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS task_tags (
        task_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (task_id, tag_id),
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `);
  }

  private insertDefaultData(): void {
    const projectCount = this.db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    
    if (projectCount.count === 0) {
      // Insert default projects
      const insertProject = this.db.prepare('INSERT INTO projects (name, color) VALUES (?, ?)');
      insertProject.run('Personal', '#3b82f6');
      insertProject.run('Work', '#10b981');
      insertProject.run('Shopping', '#f59e0b');
    }
  }

  // Task operations
  getTasks(): Task[] {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        title,
        description,
        project_id as projectId,
        priority,
        status,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt,
        completed_at as completedAt,
        parent_task_id as parentTaskId
      FROM tasks 
      ORDER BY 
        CASE 
          WHEN status = 'completed' THEN 1 
          ELSE 0 
        END,
        priority DESC,
        created_at DESC
    `);
    
    return stmt.all() as Task[];
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const stmt = this.db.prepare(`
      INSERT INTO tasks (title, description, project_id, priority, status, due_date, parent_task_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      task.title,
      task.description || null,
      task.projectId || null,
      task.priority,
      task.status,
      task.dueDate || null,
      task.parentTaskId || null
    );

    return this.getTaskById(result.lastInsertRowid as number);
  }

  updateTask(id: number, updates: Partial<Task>): Task {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id' || key === 'createdAt') continue;
      
      const dbKey = key === 'projectId' ? 'project_id' :
                   key === 'dueDate' ? 'due_date' :
                   key === 'updatedAt' ? 'updated_at' :
                   key === 'completedAt' ? 'completed_at' :
                   key === 'parentTaskId' ? 'parent_task_id' :
                   key;
      
      fields.push(`${dbKey} = ?`);
      values.push(value);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    if (updates.status === 'completed' && !updates.completedAt) {
      fields.push('completed_at = CURRENT_TIMESTAMP');
    } else if (updates.status !== 'completed') {
      fields.push('completed_at = NULL');
    }

    values.push(id);

    const stmt = this.db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getTaskById(id);
  }

  deleteTask(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  private getTaskById(id: number): Task {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        title,
        description,
        project_id as projectId,
        priority,
        status,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt,
        completed_at as completedAt,
        parent_task_id as parentTaskId
      FROM tasks 
      WHERE id = ?
    `);
    
    return stmt.get(id) as Task;
  }

  // Project operations
  getProjects(): Project[] {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        name,
        color,
        created_at as createdAt
      FROM projects 
      ORDER BY name
    `);
    
    return stmt.all() as Project[];
  }

  createProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const stmt = this.db.prepare('INSERT INTO projects (name, color) VALUES (?, ?)');
    const result = stmt.run(project.name, project.color || '#3b82f6');

    return this.getProjectById(result.lastInsertRowid as number);
  }

  updateProject(id: number, updates: Partial<Project>): Project {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id' || key === 'createdAt') continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id);

    const stmt = this.db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getProjectById(id);
  }

  deleteProject(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  private getProjectById(id: number): Project {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        name,
        color,
        created_at as createdAt
      FROM projects 
      WHERE id = ?
    `);
    
    return stmt.get(id) as Project;
  }

  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}
