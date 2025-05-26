# CLAUDE.md

## プロジェクト概要

これは [pdsadmin](https://github.com/bluesky-social/pds/tree/main/pdsadmin) コマンドのブラウザベースのインターフェースを提供するウェブアプリケーションで、コマンドラインの代わりにウェブUIを通じてPDS（Personal Data Server）の管理を可能にします。

## 開発コマンド

```bash
# 依存関係をインストール
pnpm i

# 開発サーバーを起動（ローカルPDSのセットアップを含む）
pnpm dev

# 本番用ビルド
pnpm build

# リントとフォーマットのチェックを実行
pnpm lint

# リントとフォーマットの問題を修正
pnpm format

# 型チェックを実行
pnpm typecheck

# ローカルPDSのセットアップ
pnpm setup-dev-env

# エンドツーエンドテストを実行(事前にpnpm buildとpnpm setup-dev-envが必要)
pnpm e2e
```

開発サーバーの実行先: http://localhost:5173

ローカルPDSの認証情報:

- URL: http://localhost:2583
- パスワード: admin-pass

## アーキテクチャ

### 状態管理

- グローバル状態管理に Jotai を使用
- セッション状態は `atomWithStorage` を介して localStorage に永続化
- `src/atoms/` の主要なアトム:
  - `session.ts`: 認証状態と PDS 接続情報
  - `account-list.ts`: アカウントデータとページネーション
  - `modal.ts`: モーダルダイアログの状態
  - `toast.ts`: トースト通知の状態

### PDS 通信

- `src/utils/pds.ts` に API 通信用のメイン `PDS` クラスが含まれています
- AT Protocol 通信に @atcute/client を使用
- 管理者認証情報による基本認証
- すべての主要な pdsadmin 操作をサポート: アカウント一覧、テイクダウン/テイクダウン解除、削除、招待コード、クロールリクエスト

### コンポーネント構造

- すべての管理アクションにモーダルベースの UI
- `src/components/modal/body/` に各操作の特定のモーダルコンテンツが含まれています
- アカウント一覧の無限スクロール
- モバイルファーストアプローチに最適化されたレスポンシブデザイン

### 開発環境

- ローカル AT Protocol 開発環境を自動的にセットアップして実行
- ローカル PDS インスタンスを管理するために `scripts/` ディレクトリのスクリプトを使用
- React と TypeScript による Vite ベースの開発
- スタイリングに TailwindCSS + DaisyUI を使用

### e2eテストのコード規約

- テストは並列実行されているため、実行順に依存しないようにテストケースを作成する
- 可能な限りgetTestByIdを使用し、必要に応じて実装側にdata-testidを追加する

## 開発時のルール

- コミットする前に以下のコマンドを実行してコードに問題がないことを確認してください
  - pnpm lint
  - pnpm typecheck
- lintエラーがある場合は以下のコマンドで自動修正できます
  - pnpm format
- コンポーネント単体で完結するようtailwindのクラスを指定し、位置を指定するクラスはclassNameという名前のpropsで受け取るようにする
- コードの内容から明らかな場合はコメントを書かない
- 新しくルールが指摘された場合は.github/copilot-instructions.mdに追記する
