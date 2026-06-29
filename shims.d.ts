// Ambient stubs for ESLint plugins that ship no type declarations, so the
// TypeScript-authored flat config (eslint.config.ts) type-checks cleanly.
// These plugins only expose flat-config objects consumed structurally by
// `extends`, so an untyped (`any`) shape is acceptable here.
declare module 'eslint-plugin-jsx-a11y'
declare module 'eslint-plugin-no-unsanitized'
