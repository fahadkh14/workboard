import pool from "../config/db.js";
import { mapTask } from "../utils/dbMappers.js";

const base = `
SELECT t.*, p.name AS projectName, p.color AS projectColor,
       u.name AS assigneeName, u.avatarColor AS assigneeAvatarColor
FROM tasks t
LEFT JOIN projects p ON p.id=t.projectId
LEFT JOIN users u ON u.id=t.assigneeId`;

export default {
  async findById(id) {
    const [rows]=await pool.query(`${base} WHERE t.id=?`,[id]);
    return mapTask(rows[0]);
  },
  async findVisible(userId, filters={}) {
    let sql=`${base} WHERE (t.createdById=? OR t.assigneeId=?)`;
    const vals=[userId,userId];
    if(filters.project){sql+=" AND t.projectId=?"; vals.push(filters.project)}
    if(filters.status){sql+=" AND t.status=?"; vals.push(filters.status)}
    if(filters.priority){sql+=" AND t.priority=?"; vals.push(filters.priority)}
    sql+=" ORDER BY t.createdAt DESC";
    const [rows]=await pool.query(sql,vals); return rows.map(mapTask);
  },
  async create(data) {
    const [r]=await pool.query(
      `INSERT INTO tasks (title,description,projectId,assigneeId,createdById,priority,dueDate,tags,status)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [data.title,data.description||"",data.project||null,data.assignee||null,data.createdBy,
       data.priority||"medium",data.dueDate||null,JSON.stringify(data.tags||[]),data.status||"todo"]);
    return this.findById(r.insertId);
  },
  async update(id,data) {
    const allowed={title:"title",description:"description",project:"projectId",assignee:"assigneeId",priority:"priority",dueDate:"dueDate",tags:"tags",status:"status",completedAt:"completedAt"};
    const sets=[],vals=[];
    for(const [k,col] of Object.entries(allowed)) if(data[k]!==undefined){sets.push(`${col}=?`);vals.push(k==="tags"?JSON.stringify(data[k]||[]):data[k])}
    if(!sets.length)return this.findById(id);
    vals.push(id); const [r]=await pool.query(`UPDATE tasks SET ${sets.join(",")} WHERE id=?`,vals);
    return r.affectedRows?this.findById(id):null;
  },
  async delete(id){const [r]=await pool.query("DELETE FROM tasks WHERE id=?",[id]);return r.affectedRows>0},
  async countWhere(where, vals){const [r]=await pool.query(`SELECT COUNT(*) count FROM tasks WHERE ${where}`,vals);return Number(r[0].count)},
  async rowsWhere(where, vals, fields="createdAt,completedAt"){const [r]=await pool.query(`SELECT ${fields} FROM tasks WHERE ${where}`,vals);return r},
  async groupBy(field, where, vals){const [r]=await pool.query(`SELECT ${field} AS _id, COUNT(*) AS count FROM tasks WHERE ${where} GROUP BY ${field}`,vals);return r},
};
