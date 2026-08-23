import pool from "../config/db.js";
import { mapProject, mapUser } from "../utils/dbMappers.js";

export default {
  async findVisible(userId) {
    const [rows] = await pool.query(`
      SELECT DISTINCT p.* FROM projects p
      LEFT JOIN project_members pm ON pm.projectId=p.id
      WHERE p.ownerId=? OR pm.userId=?
      ORDER BY p.createdAt DESC`, [userId,userId]);
    for (const r of rows) {
      const [members] = await pool.query(`SELECT u.* FROM users u JOIN project_members pm ON pm.userId=u.id WHERE pm.projectId=?`, [r.id]);
      r.members = members.map(mapUser);
    }
    return rows.map(mapProject);
  },
  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM projects WHERE id=?", [id]);
    if (!rows[0]) return null;
    const [members] = await pool.query(`SELECT u.* FROM users u JOIN project_members pm ON pm.userId=u.id WHERE pm.projectId=?`, [id]);
    rows[0].members = members.map(mapUser);
    return mapProject(rows[0]);
  },
  async create(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [r] = await conn.query(
        `INSERT INTO projects (name,description,color,status,ownerId,dueDate) VALUES (?,?,?,?,?,?)`,
        [data.name,data.description||"",data.color||"#5B5CE2",data.status||"active",data.owner,data.dueDate||null]
      );
      await conn.query("INSERT INTO project_members (projectId,userId) VALUES (?,?)", [r.insertId,data.owner]);
      await conn.commit();
      return this.findById(r.insertId);
    } catch(e) { await conn.rollback(); throw e; } finally { conn.release(); }
  },
  async update(id, data) {
    const allowed=["name","description","color","status","dueDate"];
    const sets=[], vals=[];
    for (const key of allowed) if (data[key] !== undefined) { sets.push(`${key}=?`); vals.push(data[key]); }
    if (!sets.length) return this.findById(id);
    vals.push(id);
    const [r]=await pool.query(`UPDATE projects SET ${sets.join(",")} WHERE id=?`,vals);
    return r.affectedRows ? this.findById(id) : null;
  },
  async delete(id) {
    const [r]=await pool.query("DELETE FROM projects WHERE id=?", [id]);
    return r.affectedRows > 0;
  }
};
