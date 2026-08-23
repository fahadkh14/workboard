# database/

Reference MySQL schema for WorkBoard.

- `schema.sql` — all table definitions (`users`, `projects`, `project_members`,
  `tasks`, `activities`, `notifications`) with their columns, indexes, and
  foreign keys.

**You don't need to run this manually.** When you start the stack with
`docker compose up`, the backend connects to MySQL on boot and creates every
table itself (see `backend/src/config/db.js`) — this file is kept here purely
as documentation and for anyone who wants to load the schema into an external
MySQL instance by hand:

```bash
mysql -h <host> -u <user> -p < database/schema.sql
```
