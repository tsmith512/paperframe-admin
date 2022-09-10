declare module 'remark-html' {
  const html: any;
  export default html;
}

// These two are used in paperframe-api, which this project imports to share
// some interefaces.
import KVNamespace from '@cloudflare/workers-types';
import R2Bucket from '@cloudflare/workers-types';
