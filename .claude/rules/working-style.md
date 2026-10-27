# How to work in this repo

- Change only what is named. Don't rename or restyle things that weren't asked about.
- Don't add settings to the Page settings panel or its side tab unless asked.
- Sample emails use `@chrissimari.com`.
- Commits: never add a `Co-Authored-By` line or any "Generated with Claude Code" text, to commits or PR descriptions.
- Commit with the repo-local GitHub no-reply identity. Ask before pushing, tagging or publishing; the repo is public.
- Update the README when behavior or components change.
- When the version in `package.json` changes, change `VERSION` in `sw.js` to match (a test checks). After pushing a new tag, purge the CDN cache at purge.jsdelivr.net.

## Versions and releases

- Small steps: a fix, a polish or one new component is a patch (1.2.0 to 1.2.1). A minor version (1.3.0) is for a real batch of new work, and a major one only for breaking changes (such as renaming public classes).
- Release less often. Keep working on `main` and bump the version in `package.json` and `sw.js` for the next release, but do not tag, create a GitHub Release or purge the CDN until Chris says to release.
- The release after 1.2.0 is 1.2.1. It will include pagination, the service worker and the copyright footer, plus whatever lands before Chris says to cut it.
