# Payload 3 Reproductions

> \[!IMPORTANT\]
>
> Please make sure that you do not modify the .env.example’s DATABASE_URI

This repository uses SQLite and pushes the file `payload.db` to github, with the first user created for `autoLogin` and any initial data necessary for respective branch reproductions.


# Current issue
Lexical blocks doesn't support having other blocks inside of them. Results in Runtime error when trying to render the editor.
See:
src/payload.config.ts

```ts
  editor: lexicalEditor({
    features({ defaultFeatures, rootFeatures, }) {
      return[
        ...defaultFeatures,
        BlocksFeature({ blocks: ['column'] }), // - Not working
        // BlocksFeature({ blocks:['columnWithoutArray',],}) // Still not working
        // BlocksFeature({ blocks:['columnWithoutBlocks']}) // Working, because we are not using blocks inside this block
      ]
    },
  }),
```


Logs:
```
 ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {name: "content", type: "text", label: ..., validate: function, hooks: ..., access: ..., admin: ...}
                                                        ^^^^^^^^
    at stringify (<anonymous>) {
  digest: '2883471953'
}
 ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {name: "id", type: "text", admin: ..., defaultValue: function defaultValue, hooks: ..., label: ..., validate: ..., access: ...}
                                                       ^^^^^^^^^^^^^^^^^^^^^
    at stringify (<anonymous>) {
  digest: '2866387121'
}
 ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  [function]
   ^^^^^^^^
    at stringify (<anonymous>) {
  digest: '3465642717'
}
 ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  [function]
   ^^^^^^^^
    at stringify (<anonymous>) {
  digest: '3465642717'
}
 ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {name: "id", type: "text", admin: ..., defaultValue: ..., hooks: ..., label: ..., validate: function, access: ...}
                                                                                              ^^^^^^^^
    at stringify (<anonymous>) {
  digest: '2934958097'
}
 ⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {name: ..., type: "text", admin: ..., label: ..., required: ..., validate: function, hooks: ..., access: ...}
                                                                             ^^^^^^^^
    at stringify (<anonymous>) {
  digest: '3261952081'
}
 GET /admin/collections/lexical-test/create 500 in 9644ms
```

## Payload info

```
Binaries:
  Node: 22.16.0
  npm: 10.9.2
  Yarn: N/A
  pnpm: 10.19.0
Relevant Packages:
  payload: 3.74.0 //Also tested on 3.65.0 and 3.69.0 with same results
  next: 15.4.7
  @payloadcms/db-sqlite: 3.74.0
  @payloadcms/drizzle: 3.74.0
  @payloadcms/email-nodemailer: 3.74.0
  @payloadcms/graphql: 3.74.0
  @payloadcms/live-preview: 3.74.0
  @payloadcms/live-preview-react: 3.74.0
  @payloadcms/next/utilities: 3.74.0
  @payloadcms/payload-cloud: 3.74.0
  @payloadcms/plugin-nested-docs: 3.74.0
  @payloadcms/richtext-lexical: 3.74.0
  @payloadcms/translations: 3.74.0
  @payloadcms/ui/shared: 3.74.0
  react: 19.2.0
  react-dom: 19.2.0
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 25.2.0: Tue Nov 18 21:09:40 PST 2025; root:xnu-12377.61.12~1/RELEASE_ARM64_T6000
  Available memory (MB): 16384
  Available CPU cores: 10

//Same thing on windows
Operating System:
  Platform: win32
  Arch: x64
  Version: Windows 11 Pro
  Available memory (MB): 32673
  Available CPU cores: 16

```
## Reproduction steps
1. Clone this repository
2. Install dependencies with `pnpm install`
3. Run `pnpm dev`
4. Go to `http://localhost:3000/admin/collections/lexical-test/create`
5. See errors in console and 500 error in browser

## Notes
- Removing the BlocksFeature from the editor features makes the error go away, or removing block that have block fields inside of them.
- Using dev without turbo also produces the same error.