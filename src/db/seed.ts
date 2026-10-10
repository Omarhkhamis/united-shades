/**
 * Seeds the database with the original website content and the first dashboard account.
 * Safe to re-run: existing sections and accounts are left untouched.
 *   npm run db:seed
 */
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { defaultContent, sectionKeys } from "../content/defaults";
import { adminUsers, siteSections } from "./schema";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const sections = await db
    .insert(siteSections)
    .values(sectionKeys.map((key) => ({ key, data: defaultContent[key] })))
    .onConflictDoNothing()
    .returning({ key: siteSections.key });
  console.log(`sections: ${sections.length} inserted, ${sectionKeys.length - sections.length} already present`);

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const created = await db
      .insert(adminUsers)
      .values({ email, passwordHash: await bcrypt.hash(password, 12) })
      .onConflictDoNothing()
      .returning({ id: adminUsers.id });
    console.log(created.length ? `admin created: ${email}` : `admin already exists: ${email}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin account created");
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
