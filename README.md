# pdsadmin-web

A web application that allows you to execute [pdsadmin](https://github.com/bluesky-social/pds/tree/main/pdsadmin) command equivalent operations in the browser

![](./screenshot.png)

## Features

- [x] pdsadmin account list
- [x] pdsadmin account create
- [x] pdsadmin account delete
- [x] pdsadmin account takedown
- [x] pdsadmin account untakedown
- [x] pdsadmin account reset-password
- [x] pdsadmin create-invite-code
- [x] pdsadmin request-crawl

## Development

```
pnpm i
pnpm dev
```

After starting the Vite development server with `pnpm dev`, please open http://localhost:5173.

You can signin to the local PDS with the following credentials:

- PDS URL ... http://localhost:2583
- Password ... admin-pass
