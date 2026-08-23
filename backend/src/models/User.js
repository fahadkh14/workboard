import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { mapUser } from "../utils/dbMappers.js";

export default {
  async findById(id, includePassword = false) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return mapUser(rows[0], includePassword);
  },
  async findByEmail(email, includePassword = false) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    return mapUser(rows[0], includePassword);
  },
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY name ASC");
    return rows.map((r) => mapUser(r));
  },
  async create({ name, email, password, avatarColor }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name,email,password,avatarColor) VALUES (?,?,?,?)",
      [name.trim(), email.toLowerCase().trim(), hash, avatarColor]
    );
    return this.findById(result.insertId);
  },
  async updateProfile(id, { name, title }) {
    await pool.query("UPDATE users SET name=?, title=? WHERE id=?", [name, title, id]);
    return this.findById(id);
  },
  async comparePassword(user, candidate) {
    return bcrypt.compare(candidate, user.password);
  },
};
