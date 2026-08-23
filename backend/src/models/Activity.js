import pool from "../config/db.js";
export default {
  async create({user,task,project,action,meta}) {
    const [r]=await pool.query("INSERT INTO activities (userId,taskId,projectId,action,meta) VALUES (?,?,?,?,?)",[user,task||null,project||null,action,meta?JSON.stringify(meta):null]);
    return { _id:r.insertId,id:r.insertId,user,task,project,action,meta,createdAt:new Date() };
  },
  async findByTask(taskId) {
    const [rows]=await pool.query(`SELECT a.*,u.name AS userName,u.avatarColor AS userAvatarColor FROM activities a JOIN users u ON u.id=a.userId WHERE a.taskId=? ORDER BY a.createdAt DESC`,[taskId]);
    return rows.map(r=>({_id:r.id,id:r.id,user:{_id:r.userId,id:r.userId,name:r.userName,avatarColor:r.userAvatarColor},task:r.taskId,project:r.projectId,action:r.action,meta:r.meta,createdAt:r.createdAt}));
  }
};
