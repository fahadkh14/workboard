import pool from "../config/db.js";
export default {
  async findForUser(userId){const [r]=await pool.query(`SELECT * FROM notifications WHERE userId=? ORDER BY createdAt DESC LIMIT 50`,[userId]);return r.map(this.map)},
  map(r){return {_id:r.id,id:r.id,user:r.userId,type:r.type,title:r.title,body:r.body,read:Boolean(r.readFlag),relatedTask:r.relatedTaskId,relatedProject:r.relatedProjectId,createdAt:r.createdAt,updatedAt:r.updatedAt}},
  async unreadCount(userId){const [r]=await pool.query("SELECT COUNT(*) count FROM notifications WHERE userId=? AND readFlag=0",[userId]);return Number(r[0].count)},
  async markRead(id,userId){const [r]=await pool.query("UPDATE notifications SET readFlag=1 WHERE id=? AND userId=?",[id,userId]);if(!r.affectedRows)return null;const [rows]=await pool.query("SELECT * FROM notifications WHERE id=?",[id]);return this.map(rows[0])},
  async markAllRead(userId){await pool.query("UPDATE notifications SET readFlag=1 WHERE userId=? AND readFlag=0",[userId])},
  async create(d){const [r]=await pool.query(`INSERT INTO notifications (userId,type,title,body,relatedTaskId,relatedProjectId) VALUES (?,?,?,?,?,?)`,[d.user,d.type||"system",d.title,d.body||"",d.relatedTask||null,d.relatedProject||null]);const [rows]=await pool.query("SELECT * FROM notifications WHERE id=?",[r.insertId]);return this.map(rows[0])}
};
