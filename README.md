# Payload 3 Reproductions

> \[!IMPORTANT\]
>
> Please make sure that you do not modify the .env.example’s DATABASE_URI

This repository uses SQLite and pushes the file `payload.db` to github, with the first user created for `autoLogin` and any initial data necessary for respective branch reproductions.

## Reproduction: no validation for slugs shared between collections and globals

Payload throws `DuplicateCollection` when two collections share a slug, but nothing stops a
collection and a global (or two globals) from sharing one. Each database adapter then fails in its
own way, sometimes silently.

Setup: `src/collections/Settings.ts` and `src/globals/Settings.ts` both use the slug `settings`.
`payload.db` contains the dev user and one `settings` collection doc.

### SQLite: silent data corruption

1. `pnpm dev`, log in (auto-login)
2. Open Collections → Settings → "Collection doc", note its title
3. Open Globals → Settings, set Title to `Global title`, save
4. Go back to the collection doc: its title is now `Global title`
5. Set `Collection Only` on any collection doc and save: the value is dropped without an error

Both entities share the `settings` table, which only has the global's columns
(`id, title, global_only, …`). The global reads/writes the first row of that table, which is a
collection document.

### MongoDB: crash on startup

`pnpm dev:mongo` (in-memory MongoDB) fails on init with
``OverwriteModelError: Cannot overwrite `settings` model once compiled.``
