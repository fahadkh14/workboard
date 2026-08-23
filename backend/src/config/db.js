import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "workboard",
  user: process.env.DB_USER || "workboard",
  password: process.env.DB_PASSWORD || "workboard_password",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  charset: "utf8mb4",
  dateStrings: false,
});

const schema = [
`CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','member') NOT NULL DEFAULT 'member',
  title VARCHAR(120) NOT NULL DEFAULT 'Team Member',
  avatarColor VARCHAR(20) NOT NULL DEFAULT '#5B5CE2',
  status ENUM('online','away','offline') NOT NULL DEFAULT 'online',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB`,

`CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#5B5CE2',
  status ENUM('active','on_hold','completed','archived') NOT NULL DEFAULT 'active',
  ownerId INT UNSIGNED NOT NULL,
  dueDate DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_owner FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_projects_owner_status (ownerId,status)
) ENGINE=InnoDB`,

`CREATE TABLE IF NOT EXISTS project_members (
  projectId INT UNSIGNED NOT NULL,
  userId INT UNSIGNED NOT NULL,
  PRIMARY KEY (projectId,userId),
  CONSTRAINT fk_pm_project FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pm_user (userId)
) ENGINE=InnoDB`,

`CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  projectId INT UNSIGNED NULL,
  assigneeId INT UNSIGNED NULL,
  createdById INT UNSIGNED NOT NULL,
  status ENUM('todo','in_progress','completed','blocked') NOT NULL DEFAULT 'todo',
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  tags JSON NULL,
  dueDate DATETIME NULL,
  completedAt DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assigneeId) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_tasks_creator FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tasks_creator_status (createdById,status),
  INDEX idx_tasks_assignee_status (assigneeId,status),
  INDEX idx_tasks_project (projectId),
  INDEX idx_tasks_due (dueDate)
) ENGINE=InnoDB`,

`CREATE TABLE IF NOT EXISTS activities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId INT UNSIGNED NOT NULL,
  taskId INT UNSIGNED NULL,
  projectId INT UNSIGNED NULL,
  action VARCHAR(255) NOT NULL,
  meta JSON NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_activity_task FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_activity_project FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_activity_task (taskId),
  INDEX idx_activity_created (createdAt)
) ENGINE=InnoDB`,

`CREATE TABLE IF NOT EXISTS notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId INT UNSIGNED NOT NULL,
  type ENUM('assignment','status_change','comment','mention','system') NOT NULL DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  readFlag TINYINT(1) NOT NULL DEFAULT 0,
  relatedTaskId INT UNSIGNED NULL,
  relatedProjectId INT UNSIGNED NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notifications_task FOREIGN KEY (relatedTaskId) REFERENCES tasks(id) ON DELETE SET NULL,
  CONSTRAINT fk_notifications_project FOREIGN KEY (relatedProjectId) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_notifications_user_read_created (userId,readFlag,createdAt)
) ENGINE=InnoDB`
];

export async function connectDB() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    for (const statement of schema) await connection.query(statement);
  } finally {
    connection.release();
  }
  console.log("[workboard] MySQL connected and schema ready");
}

export async function withTransaction(fn) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await fn(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
