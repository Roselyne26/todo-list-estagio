import { createTaskApi } from '../../../lib/tasks-api.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const api = createTaskApi();
export const GET = api.GET;
export const POST = api.POST;
export const PUT = api.PUT;
export const PATCH = api.PATCH;
export const DELETE = api.DELETE;
