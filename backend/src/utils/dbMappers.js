export function normalizeId(value) {
  return value == null ? null : Number(value);
}
export function parseJson(value, fallback = []) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try { return JSON.parse(value); } catch { return fallback; }
}
export function toDateOrNull(value) {
  return value ? new Date(value) : null;
}
export function mapUser(row, includePassword = false) {
  if (!row) return null;
  const user = {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    title: row.title,
    avatarColor: row.avatarColor,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
  if (includePassword) user.password = row.password;
  return user;
}
export function mapProject(row) {
  if (!row) return null;
  return {
    _id: row.id, id: row.id, name: row.name, description: row.description,
    color: row.color, status: row.status, owner: row.ownerId,
    dueDate: row.dueDate, createdAt: row.createdAt, updatedAt: row.updatedAt,
    members: row.members ?? [],
  };
}
export function mapTask(row) {
  if (!row) return null;
  return {
    _id: row.id, id: row.id, title: row.title, description: row.description,
    project: row.projectId ? { _id: row.projectId, id: row.projectId, name: row.projectName, color: row.projectColor } : null,
    projectId: row.projectId,
    assignee: row.assigneeId ? { _id: row.assigneeId, id: row.assigneeId, name: row.assigneeName, avatarColor: row.assigneeAvatarColor } : null,
    assigneeId: row.assigneeId, createdBy: row.createdById,
    status: row.status, priority: row.priority, tags: parseJson(row.tags, []),
    dueDate: row.dueDate, completedAt: row.completedAt,
    createdAt: row.createdAt, updatedAt: row.updatedAt,
  };
}
