# pdsadmin-web

[pdsadmin](https://github.com/bluesky-social/pds/tree/main/pdsadmin) コマンド相当の処理をブラウザ上で実行することが出来るWebアプリ

![](./screenshot.png)

## 機能

- [x] pdsadmin account list
- [x] pdsadmin account create
- [x] pdsadmin account delete
- [x] pdsadmin account takedown
- [x] pdsadmin account untakedown
- [x] pdsadmin account reset-password
- [x] pdsadmin create-invite-code
- [x] pdsadmin request-crawl

## 開発

```
pnpm i
pnpm dev
```

`pnpm dev`で Vite の開発サーバーが起動したら http://localhost:5173 を開いてください。

ローカル環境のPDSには以下でログインできます。

- PDSのURL ... http://localhost:2583
- パスワード ... admin-pass
