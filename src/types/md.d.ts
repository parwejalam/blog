// Markdown files are loaded as raw strings (see the `.md` loader in angular.json).
declare module '*.md' {
  const content: string;
  export default content;
}
