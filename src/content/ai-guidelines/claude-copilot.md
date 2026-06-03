---
title: 'ClaudeCode Copilot 利用ガイド'

publishDate: 2026-05-28

category: 'AI-guidelines'

order: 1
---

**対象業務**: HTML/CSS/JavaScript静的コーディング、WordPress サイト制作、Astro・Vueでのサイト制作
**最終更新**: 2026年5月

- [概要](#概要)
- [ツール選択ガイド](#ツール選択ガイド)
- [セキュリティガイドライン](#セキュリティガイドライン)
- [対象作業と活用方法](#対象作業と活用方法)
- [ベストプラクティス](#ベストプラクティス)
- [トラブルシューティング](#トラブルシューティング)

## 概要

### Claude Code

AI アシスタント機能で、以下の特徴があります：

- **インタラクティブなコード生成**: ターミナルコマンドやファイル操作が可能
- **ローカル実行**: コードは PC 上で実行されセキュリティが高い
- **リアルタイムフィードバック**: エラーの即座の修正が可能
- **複雑な処理に適している**: ビルド設定、環境構築、スクリプト実行など

### Copilot

コード補完機能で、以下の特徴があります：

- **コード補完**: 数文字の入力で関連コードを提案
- **スニペット生成**: よくあるコードパターンを素早く生成
- **単純なコード作成に最適**: 定型的なコーディング作業の高速化

## ツール選択ガイド

|                    | Claude Code                                  | Copilot                                    |
| ------------------ | -------------------------------------------- | ------------------------------------------ |
| **得意な事**       | セットアップ、複雑な処理、エラー修正         | コード補完、パターン提案、簡単な実装       |
| **使用頻度**       | プロジェクト開始時、エラー時                 | コーディング中、常時                       |
| **結果の確認**     | すぐに画面に反映される（ターミナルを見る）   | 生成されたコードを確認してから使う         |
| **利用タイミング** | 「一気に環境を整えたい」「複雑だから教えて」 | 「コード補完が欲しい」「パターンを教えて」 |

### 簡単判断フロー

```
あなたの作業は何ですか？

「パソコンの設定が必要」「コマンド実行が必要」
   ↓
   → Claude Code 🔧

「コードを数行書きたい」「パターンを提案してほしい」
   ↓
   → Copilot ✨

「複雑な問題が起きた」「ファイルをいっぱい修正したい」
   ↓
   → Claude Code 🔧
```

### Claude Code を選ぶべき場面

**1. プロジェクトの最初のセットアップ**
新しいプロジェクトを始めるときに必要な準備

- 例：Node.js プロジェクトを新規作成する、npm パッケージをインストールする
- 理由: ターミナルでコマンドを実行する必要がある

**2. エラーが出たときの修正**
ビルドが失敗した、コンパイルエラーが出た など

- 例：「このエラーが出ました、直してください」と依頼する
- 理由: エラーメッセージを見ながら、その場で修正・確認できる

**3. ファイル構成を大きく変える**
複数のフォルダやファイルを整理・再配置する作業

- 例：プロジェクトディレクトリを再構成する、古いファイルを削除する
- 理由: 多数のファイルを同時に操作できる

**4. 複雑な機能を一から作る**
複数のファイルが関連する、難しい機能を実装する

- 例：認証機能、データベース連携、API のセットアップ
- 理由: ファイル間の関係性を理解した上で、まとめて作成・修正できる

**5. ビルド設定やスクリプト作成**
webpack、vite などのビルドツールを設定する、自動化スクリプトを作成する

- 例：本番環境用のビルド設定、デプロイスクリプト
- 理由: 実行結果を確認しながら調整できる

### Copilot を選ぶべき場面

**1. HTML や CSS をサッと書く**
よくあるパターンのコードを素早く作成したい

- 例：ナビゲーションメニューのHTML、ボタンのCSS
- 理由: 数秒で完成する、パターンが決まっている

**2. JavaScript の定型的なコードを書く**
何度も書いたことがあるようなコード

- 例：イベントリスナーの設定、簡単な関数定義
- 理由: パターンが決まっているので、補完が正確

**3. ちょっとスタイルを調整する**
CSS の値を変えたり、HTMLクラスを追加したり

- 例：マージンを調整、色を変える
- 理由: その場で素早く試行錯誤できる

**4. コードの参考例を探す**
Vue や Astro の書き方を学ぶ、サンプルコードが欲しい

- 例：Vue コンポーネントのテンプレート、CSS Grid の例
- 理由: よくあるパターンをすぐに確認できる

**5. コード補完をもらう**
1～2行 タイプしたら、残りを自動補完してほしい

- 例：関数の中身を自動補完
- 理由: 入力の手間が減る

### 併用のポイント

```
【プロジェクト開始】
  ↓
Claude Code を使う
「プロジェクト初期化してください」
  ↓
フォルダとファイルができる、npm install も実行される
  ↓
【開発開始】
  ↓
Copilot を使う
「function xxx(){」とタイプ → Copilot が中身を提案
「<div class=」とタイプ → Copilot が class 名を提案
  ↓
【エラーが出た】
  ↓
Claude Code を使う
「このエラーを直してください」とエラーメッセージを貼り付け
  ↓
エラーが修正される
  ↓
【またコーディング】
  ↓
Copilot に戻る
```

### ページ作成時のツール選択

**パターン1: 新しいページをゼロから作る**

```
例：「商品一覧ページを作ってください」

手順1️⃣ Claude Code を使う
  「src/pages/products.vue を新規作成してください」
  → ページファイルが作られる、基本構成ができる

手順2️⃣ Copilot を使う
  既存コードを見ながら、細かく調整
  「このボタンのスタイルを変えて」
  → 細部を整える
```

**パターン2: 既存ページを修正・拡張する**

```
例：「トップページにニュースセクションを追加して」

手順1️⃣ Copilot を使う
  既存のセクションの下に数行タイプすると
  → Copilot がパターンを提案

手順2️⃣ Claude Code を使う（必要な場合）
  複数ファイルに関係する修正が必要なら
  「products.vue の state と連動させて」
  → 複数ファイルをまとめて修正
```

**パターン3: ページのレイアウト全体を設計する**

```
例：「ランディングページの構成を作ってください」

Claude Code を使う理由：
  ✓ ヘッダー、ナビゲーション、メインコンテンツ、フッターなど
    複数のコンポーネントが必要
  ✓ ファイル構成を決める
  ✓ コンポーネント間の関連性を考える必要がある

依頼例：
「ランディングページを以下の構成で作成してください
- Header.vue
- Hero.vue
- Features.vue
- Testimonials.vue
- Footer.vue
各ファイルの基本構造を作ってください」
```

**判断ポイント**

```
ページ作成で迷ったら、こう考える：

複数のファイルを作る必要がある？
  Yes → Claude Code
  No  → 次へ

複数のコンポーネントを組み合わせる？
  Yes → Claude Code
  No  → 次へ

既存ページに小さく追加したい？
  Yes → Copilot
  No  → Claude Code
```

**迷ったときのチェック**

```
□ パソコン の設定やターミナルコマンドが必要？ → Claude Code
□ 数行だけコードを足したい？ → Copilot
□ エラーが出ている？ → Claude Code
□ 新しいファイルを何個も作る？ → Claude Code
□ 既存コードに1～2行追加したい？ → Copilot
□ よくわからないエラーが出た？ → Claude Code にエラーを見せる
□ ページをゼロから作る？ → Claude Code
□ 既存ページを少しだけ修正？ → Copilot
□ 複数コンポーネントの組み合わせ？ → Claude Code
```

## セキュリティガイドライン

### 学習機能設定

**Claude Code の学習設定を OFF にする**
顧客の機密情報やプロジェクトコードが Anthropic のサーバーに送信・学習されることを防ぐ

- 注意: デフォルトでは Claude Code があなたの操作を学習する可能性があります

#### VSCodeプラグイン

```
1. VSCode を開く
2. Extensions → Claude Code → 設定アイコン（⚙️）
3. 「Extension Settings」を開く
4. Settings で以下を確認・OFF に設定:
   - 「Allow usage analytics」を OFF
   - 「Share Code Snippets」を OFF
   - Telemetry Level を「off」に設定
```

#### デスクトップアプリ版設定

```
1. Claude デスクトップアプリを開く
2. 設定（⚙️）→ プライバシー
3. 以下を OFF に設定:
   - 「Usage Analytics」（使用データの収集）
   - 「Share Code Snippets」（コードスニペット共有）
4. アプリを再起動して設定を反映

または settings.json で直接設定（高度な設定）:
   - telemetry.telemetryLevel: "off"
```

**GitHub Copilot の学習設定を OFF にする**
顧客プロジェクトのコードが GitHub の学習データに使用されることを防ぐため

- 注意: GitHub Copilot はコード提案の改善のため、あなたのコードスニペットを GitHub に学習データとして送信する可能性があります
- 重要: GitHub Web サイトでも学習設定の確認が必須です

#### VSCodeプラグイン

```
1. VSCode を開く
2. Extensions → GitHub Copilot → 設定アイコン（⚙️）
3. 「Extension Settings」を開く
4. 「Telemetry」→ 「Copilot: Telemetry」を OFF
5. または GitHub Web（https://github.com/settings/copilot）で設定
6. 「Allow GitHub Copilot to improve code completion by using your code snippets」を OFF
```

#### GitHub Web

```
1. GitHub にログイン（https://github.com）
2. プロフィールアイコン → Settings を開く
3. 左メニュー → Copilot
4. 「Data and privacy」セクションを確認
5. 以下を OFF に設定:
   - 「Allow GitHub to use my code snippets
     for Copilot suggestions」
   - 「Allow GitHub to use my code snippets
     for product improvements」
```

### AI に入力してはいけない情報

**以下の情報は Claude Code / Copilot に入力しないでください**

- **認証情報**: APIキー、パスワード、トークン、シークレットキー
- **個人情報**: ユーザーの実名、メールアドレス、住所、電話番号
- **顧客データ**: クライアント企業名、機密プロジェクト名、契約内容
- **財務情報**: 給与、請求額、内部の価格設定
- **ソースコード内の機密設定**: 本番環境の接続情報

### セキュアなプラクティス

#### ✅ 環境変数の管理

```javascript
// ❌ 絶対にしない
const apiKey = "sk-1234567890abcdef";

// ✅ 推奨: 環境変数を使用
const apiKey = process.env.VITE_API_KEY;
```

**Claude Code で環境構築を依頼する際**

```
プロンプト例:
「.env.example ファイルを作成してください。
実際の値は含めず、プレースホルダーのみにしてください。
例：
VITE_API_KEY=your_api_key_here
VITE_DATABASE_URL=your_database_url_here
」
```

#### Git 設定の確認

`.gitignore` に以下を含めることを確認：

```
.env
.env.local
.env.*.local
node_modules/
dist/
.DS_Store
```

**Claude Code への依頼例**

```
「このプロジェクトの .gitignore ファイルを確認してください。
.env ファイルと本番環境の認証情報が含まれていないか確認してください。」
```

#### 本番コードのチェック

AI が生成したコードを本番環境に反映する前に：

1. **セキュリティレビュー**: 機密情報が含まれていないか確認
2. **依存関係の確認**: 不必要なパッケージが含まれていないか確認
3. **パフォーマンステスト**: 本番環境での動作確認

### セキュリティチェックリスト

```
デプロイ前チェック
□ API キーが環境変数化されているか
□ デバッグ コンソール（console.log）が削除されているか
□ 本来の .env ファイルを Git リポジトリに追加していないか
□ 依存パッケージが最新のセキュリティパッチを適用しているか
□ SQL クエリは ORM/準備済みステートメントを使用しているか
□ CORS 設定が適切か
□ CSRF トークンが実装されているか（フォーム送信時）
```

## 対象作業と活用方法

### 1. HTML/CSS/JavaScript 静的コーディング

#### 1-1 プロジェクト初期化（Claude Code 推奨）

**目的**: 新規プロジェクトのセットアップ

```
プロンプト例:
「Vite を使用した HTML/CSS/JavaScript プロジェクトを初期化してください。
以下の構成にしてください：
- src/
  - index.html
  - styles/
    - main.css
  - js/
    - main.js
- package.json に必要なスクリプトを設定
」
```

**期待される出力**:

- プロジェクトディレクトリ構成
- package.json の作成
- 基本的なビルド設定

#### 1-2 HTML テンプレート作成（Copilot 推奨）

**目的**: セマンティック HTML の素早い生成

```html
<!-- プロンプト: "ナビゲーション付きヘッダーを作成" -->

<header class="header">
  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <a href="/">Logo</a>
      </div>
      <ul class="nav-menu">
        <li><a href="/">ホーム</a></li>
        <li><a href="/about">概要</a></li>
        <li><a href="/contact">連絡先</a></li>
      </ul>
    </div>
  </nav>
</header>
```

**活用例**:

- よくあるレイアウト (ヘッダー、フッター、サイドバー)
- フォーム要素
- カード コンポーネント

#### 1-3 CSS スタイリング（Copilot + Claude Code）

**Copilot での補完例**:

```css
/* 「フレックスボックス レイアウト」とプロンプト */

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

**Claude Code での複雑なタスク**:

```
プロンプト例:
「レスポンシブなグリッドシステムを作成してください。
- デスクトップ: 4列
- タブレット: 2列
- モバイル: 1列
CSS Grid を使用してください。」
```

#### 1-4 JavaScript 機能実装（Copilot + Claude Code）

**Copilot での補完例**:

```javascript
// Copilot がパターンを提案

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".toggle-btn");
  button.addEventListener("click", () => {
    // 処理
  });
});
```

**Claude Code での複雑な処理**:

```
プロンプト例:
「無限スクロール機能を実装してください。
仕様:
- ページ下部に到達したら次のデータを自動読み込み
- Intersection Observer API を使用
- ローディング状態の表示
」
```

### 2. WordPress サイト制作

#### 2-1 テーマセットアップ（Claude Code 推奨）

```
プロンプト例:
「カスタム WordPress テーマを初期化してください。
構成:
- functions.php（テーマサポート設定）
- style.css（テーマ情報）
- index.php、single.php、archive.php などのテンプレート
- CSS フォルダ構造
」
```

**期待される成果物**:

- 標準的なテーマディレクトリ構成
- functions.php の基本設定
- Template hierarchy に従ったテンプレート

#### 2-2 カスタム投稿タイプの登録（Copilot 推奨）

```php
// Copilot での補完例

function register_custom_post_type() {
  register_post_type('portfolio', array(
    'labels' => array('name' => 'Portfolio'),
    'public' => true,
    'supports' => array('title', 'editor', 'thumbnail'),
  ));
}
add_action('init', 'register_custom_post_type');
```

#### 2-3 カスタムフィールド実装（Claude Code 推奨）

```
プロンプト例:
「ACF (Advanced Custom Fields) を使わずに、
カスタムメタボックスを実装してください。
- 商品の価格と在庫数フィールド
- 管理画面での入力UI
- フロントエンドでの表示処理
」
```

#### 2-4 テンプレートのカスタマイズ（Copilot + Claude Code）

```php
// Copilot: 単純なループ補完
<?php
if (have_posts()) {
  while (have_posts()) {
    the_post();
    ?>
    <article>
      <h2><?php the_title(); ?></h2>
      <p><?php the_excerpt(); ?></p>
    </article>
    <?php
  }
}
?>
```

```
Claude Code: 複雑なクエリ実装
「特定のカテゴリから最新5件の投稿を取得し、
日付順にソート して表示するテンプレートを作成してください。」
```

### 3. Astro・Vue サイト制作

#### 3-1 Astro プロジェクト初期化（Claude Code 推奨）

```
プロンプト例:
「Astro プロジェクトを初期化してください。
要件:
- npm を使用
- TypeScript を有効化
- src/pages/, src/components/, src/layouts/ を作成
- astro.config.mjs を設定
」
```

#### 3-2 Astro コンポーネント作成（Copilot 推奨）

```astro
<!-- Copilot での補完例 -->

---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  <p>{description}</p>
</div>

<style>
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
  }
</style>
```

#### 3-3 Vue コンポーネント開発（Copilot + Claude Code）

**Copilot での補完例**:

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" type="text" />
    <button type="submit">送信</button>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  name: "",
});

const handleSubmit = () => {
  console.log(form.value);
};
</script>
```

**Claude Code での複雑な実装**:

```
プロンプト例:
「Vue 3 Composition API を使用した、
リアルタイム検索フィルター機能を実装してください。
仕様:
- 入力フィールドから検索ワード取得
- リスト項目を動的にフィルタリング
- Debounce で API 呼び出しを最適化
」
```

#### 3-4 API インテグレーション（Claude Code 推奨）

```
プロンプト例:
「Astro で REST API からデータを取得する
スタティック生成を実装してください。
- SSG で getStaticPaths() を使用
- ビルド時に外部 API から全てのページ生成
- エラーハンドリング
」
```

## ベストプラクティス

### コード品質

#### 1. プロンプトの具体性

**曖昧なプロンプト**

```
「ボタンコンポーネントを作成してください」
```

**具体的なプロンプト**

```
「Vue 3 での Primary ボタンコンポーネントを作成してください。
仕様:
- props: label (String), disabled (Boolean)
- イベント: @click
- スタイル: Tailwind CSS
- アクセシビリティ対応: aria-label, role
」
```

#### 2. ファイル構成を明確にする

```
プロンプト例:
「以下の構成で、Todo アプリを実装してください。
src/
  components/
    TodoItem.vue
    TodoList.vue
  stores/
    todoStore.js (Pinia)
  App.vue
」
```

#### 3. 段階的に進める

```
ステップ1: Claude Code で基本構造を生成
→ ステップ2: Copilot で細部を補完
→ ステップ3: Claude Code でテストスクリプトを作成
```

### パフォーマンス

#### 1. バンドルサイズの最適化

```
Claude Code への依頼:
「webpack-bundle-analyzer を使用して
バンドルサイズを分析するスクリプトを作成してください。
大きなパッケージを特定し、軽量な代替案を提案してください。」
```

#### 2. 画像最適化

```html
<img
  src="image.jpg"
  srcset="image-small.jpg 480w, image-large.jpg 1200w"
  sizes="(max-width: 768px) 480px, 1200px"
  alt="説明文"
  loading="lazy"
/>
```

### テスト駆動開発

#### Jest + Vue Test Utils の例

```
Claude Code への依頼:
「Vue 3 コンポーネント Button.vue のテストを Vitest で実装してください。
テストケース:
- クリック時に emit イベントが発火する
- disabled props が true の場合、ボタンが無効になる
」
```

## トラブルシューティング

### よくある問題と対応

#### 問題 1: Claude Code が古い構文を生成する

**症状**: Vue 2 の Options API が生成される（Vue 3 を使用中）
**対応**:

```
プロンプト追加:
「Vue 3 Composition API と <script setup> を使用してください。
Options API は使用しないでください。」
```

#### 問題 2: 生成されたコードにセキュリティ脆弱性がある

**症状**: SQL インジェクション、XSS の可能性がある
**対応**:

1. Claude Code に「セキュリティレビュー」を依頼
2. 人間がコードレビューを実施
3. デプロイ前に セキュリティスキャンツール（例: SonarQube）を実行

```
Claude Code への依頼例:
「このコードのセキュリティ脆弱性をレビューしてください。
特に以下を確認してください：
- SQL インジェクション対策
- XSS 対策
- 認証・認可処理
」
```

#### 問題 3: Copilot が不適切な補完を提案する

**症状**: コンテキストに合わないコードが補完される
**対応**:

- Copilot の提案を無視し、Reject（Ctrl+R）
- Claude Code に詳細なプロンプトで依頼

#### 問題 4: ビルドが失敗する

**症状**: TypeScript エラーや依存関係の問題
**対応**:

```
Claude Code への依頼:
「エラーメッセージ:
[ここに全エラーを貼り付け]

このエラーを解決してください。」
```

### パフォーマンス最適化のチェックリスト

```
実装後の確認項目

□ Core Web Vitals が要件を満たしているか (LCP, CLS, FID)
□ バンドルサイズが 200KB 以下か（圧縮後）
□ 不要な再レンダリングがないか
□ 画像は最適化されているか（WebP 形式）
□ CSS が最小化されているか
□ JavaScript が Tree-shaking されているか
□ 本番環境でのビルド確認をしたか
```

## 参考リンク

- [Claude Code ドキュメント](https://docs.anthropic.com/)
- [GitHub Copilot ベストプラクティス](https://github.com/features/copilot)
- [Astro ドキュメント](https://astro.build/)
- [Vue 3 ドキュメント](https://vuejs.org/)
- [WordPress テーマ開発](https://developer.wordpress.org/themes)