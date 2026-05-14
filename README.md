# フロントエンドポータル

## 環境構築

### セットアップ

```bash
cd src
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## URL

https://frontend-portal-beryl.vercel.app/

## ガイドライン運用フロー

### 新規追加

1. `src\content`の該当するカテゴリの中にmdファイルを追加
2. 以下の項目を**必ず**設定する
   1. `title`: タイトル
   2. `publishDate`: 公開日
   3. `category`: 単一カテゴリー
   4. `order`: カテゴリー内の表示する順番の制御

### 更新

1. `src\content`の該当するカテゴリの中にmdファイルを更新
2. `updatedDate`がない場合は追加、ある場合は更新する

## 新規カテゴリーを追加する場合

新規カテゴリーの場合は一覧ページやヘッダーナビで表示する順番を制御するために `/src/constants/categoryOrder.ts`の `CATEGORY_ORDER`を更新する

## 開発ドキュメント

- [コーディング規約](./docs/CODING_STANDARDS.md)
- [コンポーネント開発ガイドライン](./docs/COMPONENT_DEVELOPMENT_GUIDE.md)
