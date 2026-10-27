# How to work in this repo

- Change only what is named. Don't rename or restyle things that weren't asked about.
- Don't add settings to the Page settings panel or its side tab unless asked.
- Sample emails use `@chrissimari.com`.
- Commits: never add a `Co-Authored-By` line or any "Generated with Claude Code" text, to commits or PR descriptions.
- Commit with the repo-local GitHub no-reply identity. Ask before pushing, tagging or publishing; the repo is public.
- Update the README when behavior or components change.
- When the version in `package.json` changes, change `VERSION` in `sw.js` to match (a test checks). After pushing a new tag, purge the CDN cache at purge.jsdelivr.net.
