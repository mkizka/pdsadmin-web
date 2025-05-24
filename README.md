# pdsadmin-web

[pdsadmin](https://github.com/bluesky-social/pds/tree/main/pdsadmin) コマンド相当の処理をブラウザ上で実行することが出来るWebアプリです。

## 機能

- [x] PDSのURLとPDS_ADMIN_PASSWORDで疑似ログイン
- [x] アカウント一覧を表示
- [x] アカウントをTakedown
- [x] アカウントをUntakedown
- [x] アカウントを作成
- [x] アカウントを削除
- [x] 招待コードを発行
- [x] リレーにクロールをリクエスト

## 開発

```
pnpm i
pnpm dev
```

`pnpm dev`で Vite の開発サーバーが起動したら http://localhost:5173/pdsadmin-web/ を開いてください。

ローカル環境のPDSには以下でログインできます。

- PDSのURL ... http://localhost:2583
- パスワード ... admin-pass
