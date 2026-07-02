/**
 * PRISMA CLIENT SINGLETON
 * 
 * Provides a singleton instance of PrismaClient optimized for PostgreSQL
 * with connection pooling via @prisma/adapter-pg. This pattern prevents
 * connection pool exhaustion in production while maintaining performance
 * across multiple requests in development.
 * 
 * Usage:
 *   import { prisma } from "@/lib/prisma";
 *   const users = await prisma.users.findMany();
 */

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Retrieve PostgreSQL connection string from environment variables
const connectionString = process.env.DATABASE_URL!;

// Initialize PostgreSQL adapter with connection pooling
const adapter = new PrismaPg({ connectionString });

/**
 * Global Prisma Client instance with PostgreSQL adapter.
 * - Uses connection pooling for efficient resource management
 * - Singleton pattern prevents multiple client instances
 * - Configured for production-ready PostgreSQL databases
 */
export const prisma = new PrismaClient({
  adapter,
});