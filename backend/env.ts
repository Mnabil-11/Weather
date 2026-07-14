/** Server-only environment validation. Import only from server code (route handlers, lib/*Service.ts). */
export function requireEnv(name: string, helpUrl: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to .env.local (see ${helpUrl}).`);
  return value;
}
