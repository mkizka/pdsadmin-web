# pdsadmin-web

[pdsadmin](https://github.com/bluesky-social/pds/tree/main/pdsadmin) コマンド相当の処理をブラウザ上で実行することが出来るWebアプリです。

## 機能

- [x] PDSのURLとPDS_ADMIN_PASSWORDで疑似ログイン
- [x] アカウント一覧を表示
- [x] アカウントをTakedown
- [x] アカウントをUntakedown
- [ ] アカウントを作成
- [x] アカウントを削除
- [x] 招待コードを発行
- [ ] リレーにクロールをリクエスト

## 開発

```
pnpm i
pnpm dev
```

ローカル環境での開発時は以下でログインできます。

- PDSのURL ... http://localhost:2583
- パスワード ... [admin-pass](https://github.com/bluesky-social/atproto/blob/36dbd41551f74052a3f584719a1a7edd86eca201/packages/pds/example.env#L19)
