//File: src/types/xss-clean.d.ts
declare module 'xss-clean' {
    const xss: () => express.RequestHandler;
    export default xss;
  }