/**
 * NextAuth API route for HR Management Platform
 * Handles authentication endpoints for email/password login
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
