// Removing edge runtime to use Vercel's default Node.js environment
// which has full access to node_modules and avoids module bundling errors.
import server from '../dist/server/server.js';

export default function(req) {
  return server.fetch(req);
}
