import { pgTable, serial,  timestamp,varchar} from "drizzle-orm/pg-core";

 export const userTable = pgTable("userTable", {
    userId: serial("userId").primaryKey(),
    userName: varchar("userName", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),  
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});     


//Infer Types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;