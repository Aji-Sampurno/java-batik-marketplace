process.env.HOST = process.env.HOST || '0.0.0.0';
process.env.PORT = process.env.PORT || '4321';

import('./dist/server/entry.mjs');
