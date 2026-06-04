---
title: 'WordPress開発ガイドライン'
publishDate: 2026-06-03
updatedDate: 2026-06-03
category: 'wordpress'
order: 1
---

## 概要

このドキュメントは、WordPressを用いたサイト開発における設計・コーディング・セキュリティ・パフォーマンスの品質を一定以上に保つためのガイドラインです。
メンテナンス性が高く、セキュリティ的に堅牢で、かつ高速に動作するWordPressサイトの構築を目指します。

---

## 1. コーディングスタイル

WordPress開発では、原則として公式の「WordPress Coding Standards (WPCS)」に準拠したコーディングを行います。これにより、複数人での共同開発や長期的なメンテナンス時のコード可読性を確保します。

### 1.1 PHP
* **命名規則**:
  - 変数名・関数名・オプション名: スネークケース（`snake_case`）を使用します。
  - クラス名: パスカルケース（`PascalCase`）を使用し、単語間はアンダースコアで区切ります（例: `My_Custom_Class`）。
  - ファイル名: クラス定義ファイルは `class-` をプレフィックスとし、小文字とハイフンを使用します（例: `class-my-custom-class.php`）。それ以外のテンプレートや関数ファイルは `single-` や `taxonomy-` などの標準ルールに従うか、小文字とハイフンで命名します。
* **インデント**: タブを使用します（スペースではありません）。エディタ設定でタブ幅を「4」に設定することを推奨します。
* **スペースの挿入**: 読みやすさを確保するため、括弧の内側や演算子の前後にスペースを挿入します。
  ```php
  // 〇 正しい例：括弧の内側にスペースを入れる
  if ( $is_active === true ) {
      // 処理
  }

  // ❌ 悪い例：スペースがない
  if($is_active===true){
      // 処理
  }
  ```
* **ヨーダ記法 (Yoda Conditions) の採用**:
  - 比較を行う際、定数やリテラル（変更されない値）を左側に、変数（変更される値）を右側に記述します。これにより、代入演算子（`=`）の記述ミスによる意図しないバグ（例: `if ( $is_active = true )` は常に真になってしまう）を防ぎます。
  ```php
  // 〇 正しい例
  if ( true === $is_active ) {
      // 処理
  }
  ```
* **厳密比較の徹底**:
  - 型変換による予期せぬ不具合を防ぐため、等価比較には必ず `===` または `!==` を使用します。`==` や `!=` の使用は避けてください。
* **PHPショートタグの禁止**:
  - `<?` や `<?=` のようなショートタグは、サーバー環境によって無効化されている場合があるため使用を禁止します。常に標準の `<?php` および `<?php echo` を使用してください。

### 1.2 JavaScript & CSS
* **CSS & Sass**:
  - クラス名やプロパティ名はすべて小文字で記述します。
  - クラス名にはハイフン区切り（ケバブケース: `kebab-case`）を使用し、IDセレクタ（`#id`）によるスタイリングは詳細度が高くなりすぎるため極力避けます。
  - プロパティの記述順序は、レイアウト（`position`, `display`, `flex`など）→ ボックスモデル（`width`, `padding`, `margin`, `border`）→ 装飾（`background`, `color`）の順で整理します。
* **JavaScript**:
  - 原則としてプロジェクト全体のコーディング規約（ESLint / Prettier設定）に準拠します。
  - 管理画面やブロックエディタ（Gutenberg）のカスタマイズを行う際は、公式の `@wordpress/scripts` パッケージ等のビルドツールを適用し、グローバル汚染を防ぐために即時関数（IIFE）やESモジュールによるカプセル化を行います。また、WordPressが提供する `wp` グローバルオブジェクト（`wp.element`, `wp.components` など）を適切に参照して開発します。

---

## 2. テーマ開発の基本ルール

コアやプラグインのアップデートに耐えうる、堅牢でクリーンなカスタムテーマ設計を行います。

### 2.1 標準ディレクトリ・ファイル構成
本プロジェクトでは、Pug / Astro 等のモダンなビルド環境との親和性を高め、かつプラグインに頼らない軽量・安全な開発を行うため、以下のディレクトリ・ファイル構成を厳守してください。

```text
my-theme/
├── style.css             # テーマのメタ情報（テーマ名等）のみ記述
├── functions.php         # 司令塔（/functions/ 配下のファイルをループで自動読み込み）
├── index.php             # 必須ファイル（フォールバック用。基本は空で固定）
│
├── front-page.php        # トップページ
├── header.php            # 共通ヘッダー
├── footer.php            # 共通フッター
│
├── page.php              # 固定ページ用汎用ルーター（pages/【URLパス】/index.php を自動マッピング）
├── pages/                # 固定ページの中身（HTML）。「フォルダ名 ＝ URL」で等価に管理
│   ├── about/
│   │   └── index.php     # ➔ /about/
│   └── company/          
│       └── access/
│           └── index.php # ➔ /company/access/（階層の不一致、名前の競合を完全に防ぐ）
│
├── archive-[post_type].php  # 投稿・カスタム投稿の一覧ページ（WP標準ルール）
├── single-[post_type].php   # 投稿・カスタム投稿の詳細ページ（WP標準ルール）
├── taxonomy-[tax].php       # カスタムタクソノミーの一覧ページ（WP標準ルール）
│
├── assets/               # 静的アセット（ビルドツールからの書き出し先）
│   ├── css/style.css     # メインCSS（filemtimeによるキャッシュバスティング対象）
│   └── js/main.js        # Vanilla JS（jQuery非依存。フッターで非同期読み込み）
│
└── functions/            # バックエンドロジックの隔離ディレクトリ
    ├── setup.php         # テーマ初期設定（アイキャッチ、メニュー登録など）
    ├── assets.php        # CSS/JSの読み込み（wp_enqueue_xxx の一元管理）
    ├── ga.php            # 解析・広告タグの出力（環境に応じたON/OFFを容易にするため隔離）
    ├── acf-setting.php   # ACF最適化（オプションページ追加、Local JSONの有効化）
    ├── custom-post.php   # カスタム投稿タイプ・カスタムタクソノミーの登録
    ├── security.php      # セキュリティ対策（ログインエラー隠蔽、WPバージョン非表示など）
    ├── cleanup.php       # 高速化（標準の絵文字スクリプトや不要なブロックCSSの削除）
    ├── navigation.php    # 共通処理の関数化（自作パンくず、ページネーションなど）
    └── block-editor.php  # ブロックエディタの機能制限・カスタムスタイル適用
```

### 2.2 テンプレート階層とルーティング設計
* WordPressのテンプレート階層（`index.php` -> `archive.php` -> `category.php` など）を正しく理解し、WordPress本来のルーティングを活かした設計にします。
* カスタム投稿タイプやカスタムタクソノミーを作成する場合は、`single-{post_type}.php` や `archive-{post_type}.php`、`taxonomy-{tax}.php` を用意して対応します。
* ⚠️ **`query_posts()` の使用は厳禁**:
  - メインクエリを書き換える `query_posts()` は、グローバルなクエリ状態を破壊し、ページネーションの動作不良や不要なSQL発行によるパフォーマンス低下を引き起こすため、**非推奨（絶対に不使用）**とします。
  - メインクエリの取得条件を変更したい場合は、後述の `pre_get_posts` アクションフックを使用し、テンプレート内で独自のサブループを回す場合は `WP_Query` インスタンスを生成して使用します。

#### 固定ページ（Page）の設計ルール
先方指定のURL（親子孫の深い階層構造）や末尾スラッグの重複に対して、`page-xxx.php` によるルート直下での個別管理は、名前の競合やルートの肥大化を招くため**原則禁止**とします。

AstroやPug等のモダンツールと同様の**「ファイルベース・ルーティング（等価なフォルダ管理）」**を適用するため、大元の `page.php` には以下のマッピング処理のみを記述してください。

```php
<?php
/**
 * 固定ページ用フォルダ階層ルーター（page.php）
 */
get_header();

// 現在のURL（URI）を取得（例: "company/access"）
$uri = get_page_uri( get_the_ID() );

// フォルダ形式のパスを作成（例: "pages/company/access/index"）
$template_path = 'pages/' . $uri . '/index';

// 該当する index.php が存在すれば読み込み、無ければデフォルトへ
if ( locate_template( $template_path . '.php' ) ) {
    get_template_part( $template_path );
} else {
    get_template_part( 'pages/default' );
}

get_footer();
```

#### `functions.php` の自動読み込み設計
`functions.php` の肥大化による Fatal Error（画面が真っ白になる現象）のリスクを避けるため、大元の `functions.php` は直接処理を書かず、`/functions/` 配下のファイルを自動一括読み込みする「司令塔」としてのみ機能させてください。

```php
<?php
/**
 * functions.php（自動読み込み司令塔）
 */
$function_files = [
    'setup', 'assets', 'ga', 'acf-setting', 
    'custom-post', 'cleanup', 'security', 'navigation', 'block-editor'
];

foreach ( $function_files as $file ) {
    $path = get_theme_file_path( "/functions/{$file}.php" );
    if ( file_exists( $path ) ) {
        require_once $path;
    }
}
```

### 2.3 必須のアクションフックとアセット制御
自作テーマには、必ず以下の関数・フックを適切な場所に記述してください。これらが不足していると、プラグインが正常に動作しないだけでなく、テーマ全体の動作に深刻な影響を与えます。

* `wp_head()`: `</head>` タグの直前に記述します。
* `wp_body_open()`: `<body>` タグの直後に記述します。
* `wp_footer()`: `</body>` タグの直前に記述します。
* `body_class()`: `<body>` タグの属性値として適用します。

#### 標準的なテーマの基本構成例:
```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="page" class="site">
        </div>
    
    <?php wp_footer(); ?>
</body>
</html>
```

#### スクリプトとスタイルの読み込み（キューイング）:
テンプレートファイル（`header.php` など）に `<link>` や `<script>` タグを直接ハードコーディングすることは禁止します。必ず `wp_enqueue_script()` および `wp_enqueue_style()` を使用し、`wp_enqueue_scripts` アクションフック経由で読み込ませます。

本プロジェクトでは**脱jQuery（Vanilla JSでの記述）**を基本とし、パフォーマンス最適化のためメインJSはフッターで非同期読み込み（`defer`）させるか、第5引数を `true` に設定して `</body>` 直前で読み込ませます。

また、アセットファイルが更新された際にブラウザキャッシュを自動で破棄（キャッシュバスティング）するため、パラメータのバージョン情報にはファイルの最終更新時間（`filemtime()`）を渡す設計とします。

```php
// functions/assets.php 内で記述
function my_theme_enqueue_assets() {
    // テーマのメインCSS
    $css_path = get_theme_file_path( '/assets/css/style.css' );
    $css_ver  = file_exists( $css_path ) ? filemtime( $css_path ) : '1.0.0';
    wp_enqueue_style( 'my-theme-style', get_theme_file_uri( '/assets/css/style.css' ), array(), $css_ver );

    // テーマのメインJS（jQuery非依存 / フッター読み込み）
    $js_path = get_theme_file_path( '/assets/js/main.js' );
    $js_ver  = file_exists( $js_path ) ? filemtime( $js_path ) : '1.0.0';
    wp_enqueue_script( 'my-theme-script', get_theme_file_uri( '/assets/js/main.js' ), array(), $js_ver, true );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_assets' );
```

### 2.4 フック (Hooks) の活用
WordPressの拡張は、本体コアコードやサードパーティ製プラグインのファイルを直接編集せず、必ずフックシステム（アクションフックとフィルターフック）を介して実装します。

* **アクションフック (Action Hooks)**:
  - 特定の実行タイミング（テーマ読み込み時、投稿保存時、フッター出力時など）に処理を割り込ませる場合に使用します。
  - 例: テーマの初期設定を行う `after_setup_theme`（`functions/setup.php`等に記述）
    ```php
    function my_theme_setup() {
        // アイキャッチ画像の有効化
        add_theme_support( 'post-thumbnails' );
        // titleタグを自動生成
        add_theme_support( 'title-tag' );
    }
    add_action( 'after_setup_theme', 'my_theme_setup' );
    ```
* **フィルターフック (Filter Hooks)**:
  - 出力されるテキスト、クエリ条件、設定値などの「データ」を、出力やDB保存の直前に変更・加工するために使用します。
  - 例: 本文の抜粋（Excerpt）の文字数を変更する `excerpt_length`
    ```php
    function my_custom_excerpt_length( $length ) {
        return 80; // 抜粋文字数を80文字に制限
    }
    add_filter( 'excerpt_length', 'my_custom_excerpt_length', 999 );
    ```

---

## 3. セキュリティ対策 (必須)

WordPressはオープンソースゆえに脆弱性を狙った攻撃を受けやすいため、テーマおよびプラグイン開発において徹底したセキュリティ対策を組み込む必要があります。

### 3.1 出力時のエスケープ (Escaping)
動的に出力するデータは、出力する直前に文脈に合わせた適切なエスケープ関数を通して出力します（**Late Escapingの原則**）。これにより、クロスサイトスクリプティング（XSS）を防ぎます。

| 関数名 | 用途 | 例 |
| :--- | :--- | :--- |
| `esc_html()` | 一般的なHTMLテキストの出力 | `<?php echo esc_html( $text ); ?>` |
| `esc_attr()` | HTML属性値の中に埋め込む場合 | `<input value="<?php echo esc_attr( $value ); ?>">` |
| `esc_url()` | URLとして出力する場合（href, srcなど） | `<a href="<?php echo esc_url( $url ); ?>">` |
| `esc_textarea()` | textarea要素内に出力する場合 | `<textarea><?php echo esc_textarea( $text ); ?></textarea>` |
| `wp_kses_post()` | HTMLタグを一部許容して出力する場合 | `<?php echo wp_kses_post( $html_content ); ?>` |

#### 翻訳とエスケープを同時に行うショートハンド関数
多言語対応コードなどで翻訳関数を使用する場合は、エスケープ機能が組み合わさった複合関数を使用します。
```php
// 翻訳してHTMLエスケープして出力
<?php esc_html_e( 'Search Results', 'text-domain' ); ?>

// 翻訳してHTMLエスケープして値を取得
$label = esc_html__( 'Submit', 'text-domain' );

// 翻訳して属性値向けにエスケープして出力
<input placeholder="<?php esc_attr_e( 'Enter your name', 'text-domain' ); ?>">
```

#### 許可するHTMLタグを絞り込んで出力する (`wp_kses`)
特定のタグ（`<a>`, `<strong>` など）のみを許容し、それ以外のスクリプトや危険なタグをすべて削除する場合は `wp_kses()` を使用します。
```php
$allowed_tags = array(
    'a' => array(
        'href'  => array(),
        'title' => array(),
        'class' => array(),
    ),
    'br' => array(),
    'strong' => array(),
);
echo wp_kses( $raw_html, $allowed_tags );
```

### 3.2 入力時のサニタイズ (Sanitizing)
ユーザーから送信されたデータ（`$_POST` や `$_GET` 等）や外部APIなどから取得したデータを保存・利用する際は、必ず入力の時点でデータを無害化（サニタイズ）します（**Early Sanitizingの原則**）。

* 一般的なテキスト入力: `sanitize_text_field( $_POST['user_input'] )`
* 改行を保持させたいテキストエリア: `sanitize_textarea_field( $_POST['user_message'] )`
* メールアドレス: `sanitize_email( $_POST['email'] )`
* 数値・IDの強制取得:
  - 正の整数にキャストする `absint()` または整数化する `intval()` を使用します。
  ```php
  $post_id = absint( $_POST['post_id'] );
  ```
* スラッグやキー値: `sanitize_key( $_POST['slug'] )`
* ファイル名（記号などの除去）: `sanitize_file_name( $_POST['file_name'] )`

### 3.3 CSRF対策 (Nonceの利用)
フォーム送信や非同期リクエスト（Ajax / WP REST API）を処理する際は、必ず「Nonce（ワンタイムトークン）」を付与し、リクエストが本人の意思で意図的に送信されたものであるか（CSRF攻撃でないか）を検証します。

#### ① 通常のフォーム送信での実装例
**フォーム側の出力:**
```php
<form method="post" action="">
    <?php wp_nonce_field( 'my_custom_action', 'my_nonce_field' ); ?>
    <input type="text" name="my_data">
    <input type="submit" value="保存">
</form>
```
**受信側の検証:**
```php
if ( isset( $_POST['my_data'] ) ) {
    if ( ! isset( $_POST['my_nonce_field'] ) || ! wp_verify_nonce( $_POST['my_nonce_field'], 'my_custom_action' ) ) {
        wp_die( 'セキュリティエラー: 不正なリクエストです。' );
    }
    // 正常な保存処理へ進む
}
```

#### ② Ajax / REST API での実装例
WordPressの標準Ajax（`admin-ajax.php`）やREST APIで非同期リクエストを送信する際も、Nonceヘッダーやリクエストパラメータに値を含め、PHP側で検証を行います。

**JavaScript側での送信（WordPress REST APIの例）:**
WordPressは `wp_localize_script` を用いて、Nonce値をJS側に渡すことができます。
```php
// PHPでJSファイルをキューイングする際にNonceを渡す
wp_localize_script( 'my-theme-script', 'wpApiSettings', array(
    'root'  => esc_url_raw( rest_url() ),
    'nonce' => wp_create_nonce( 'wp_rest' )
) );
```
```javascript
// JS側でリクエストを投げる際、ヘッダーにNonceを含める
fetch( wpApiSettings.root + 'wp/v2/posts', {
    method: 'POST',
    headers: {
        'X-WP-Nonce': wpApiSettings.nonce,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: '新規投稿のタイトル'
    })
});
```

### 3.4 安全なデータベース操作
カスタムテーブルを操作するなど、直接SQLクエリを実行せざるを得ない場合は、必ずプレースホルダーを使用して SQLインジェクション攻撃 を防止します。

* **変数を直接SQL文字列に結合することは絶対に禁止します。**
* 必ず `$wpdb->prepare()` を使用し、値の型に応じたプレースホルダーを指定します。
  - `%s`: 文字列 (string)
  - `%d`: 整数 (integer)
  - `%f`: 浮動小数点数 (float)

```php
global $wpdb;

// 安全なクエリの構築
$post_status = 'publish';
$author_id   = 12;

$safe_query = $wpdb->prepare(
    "SELECT ID, post_title FROM {$wpdb->posts} WHERE post_status = %s AND post_author = %d",
    $post_status,
    $author_id
);

$results = $wpdb->get_results( $safe_query );
```

---

## 4. パフォーマンスの最適化

### 4.1 Transients API の活用
外部APIの呼び出し結果や、レンダリング負荷の高いカスタムSQLクエリの結果などは、Transients APIを使用して一時キャッシュします。これにより、ページ表示ごとの無駄な通信や高負荷処理を排除できます。

#### キャッシュ利用と破棄の実装パターン:
キャッシュを作成するだけでなく、データ更新時にキャッシュを能動的にクリアする（キャッシュ無効化）設計が必要です。

**データの取得とキャッシュ保存:**
```php
function get_my_external_data() {
    $cache_key = 'my_external_api_data';
    $data      = get_transient( $cache_key );

    if ( false === $data ) {
        // キャッシュがない場合のみAPIリクエストを実行
        $response = wp_remote_get( 'https://api.example.com/data' );
        if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
            $data = wp_remote_retrieve_body( $response );
            // 6時間（6 * HOUR_IN_SECONDS）キャッシュ
            set_transient( $cache_key, $data, 6 * HOUR_IN_SECONDS );
        }
    }
    return $data;
}
```

**更新時のキャッシュ破棄（例: 管理画面で特定の操作を行ったときや、保存時にキャッシュを消去する）:**
```php
// 投稿が保存・更新されたタイミングで、関連するTransientキャッシュを削除する
function clear_my_data_cache( $post_id ) {
    // 投稿タイプなどの条件を確認の上、キャッシュを削除
    delete_transient( 'my_external_api_data' );
}
add_action( 'save_post', 'clear_my_data_cache' );
```
※ Redis や Memcached などの外部オブジェクトキャッシュ（Object Cache）プラグインが動作している環境では、Transientデータは自動的にメモリ内に書き込まれるため、DBクエリすら発生しなくなり、超高速化が実現します。

### 4.2 クエリ数の削減と高速化
* **N+1問題の回避**:
  - 投稿ループの中で個別に `WP_Query` を実行するようなネストループを避け、極力一つのクエリでデータをまとめて取得するか、キャッシュを活用します。
* **`pre_get_posts` の優先使用**:
  - アーカイブページや検索結果ページなどで表示件数や並び順を変更するために、ページテンプレート内で `new WP_Query` や `query_posts` を使って再度クエリを走らせるのは無駄です。
  - アクションフック `pre_get_posts` を用いて、メインクエリがデータベースからデータを取得する前に条件を変更することで、SQLクエリの実行回数を最小限（1回）に抑えることができます。
  ```php
  // functions.php 内
  function customize_main_query( $query ) {
      // 管理画面ではなく、メインクエリであり、カスタム投稿 'news' のアーカイブである場合
      if ( ! is_admin() && $query->is_main_query() && $query->is_post_type_archive( 'news' ) ) {
          $query->set( 'posts_per_page', 20 ); // 表示件数を20件に変更
          $query->set( 'orderby', 'menu_order' ); // メニュー順でソート
      }
  }
  add_action( 'pre_get_posts', 'customize_main_query' );
  ```
* **`WP_Query` のパラメータ最適化**:
  - サブループ（`WP_Query`）を使用する際、要件に応じてパラメータを適切に指定することで、データベース処理とメモリ使用量を大幅に削減できます。

| パラメータ | 設定値 | 効果 |
| :--- | :--- | :--- |
| `'no_found_rows'` | `true` | ページネーション（改ページ）が不要な場合（例：最新記事5件のみ表示など）に指定します。SQLの `SQL_CALC_FOUND_ROWS` 実行をスキップし、総ヒット件数の計算を行わないため、クエリが大幅に高速化します。 |
| `'update_post_meta_cache'` | `false` | ループ内でカスタムフィールド（ポストメタ）を使用しない場合に指定します。メタデータのプレキャッシュをスキップします。 |
| `'update_post_term_cache'` | `false` | ループ内でカテゴリやタグなどのタクソノミー（ターム）情報を使用しない場合に指定します。ターム関係のキャッシュ構築をスキップします。 |
| `'fields'` | `'ids'` | 投稿オブジェクトのすべての情報（本文やメタデータなど）は不要で、投稿IDのみが必要な場合（IDリストの取得や関係性の確認など）に指定します。メモリ消費量を劇的に抑えられます。 |

```php
// 例: 最新のニュース5件の「IDのみ」を高速に取得するサブループ
$args = array(
    'post_type'              => 'news',
    'posts_per_page'         => 5,
    'no_found_rows'          => true, // ページネーション不要
    'update_post_meta_cache' => false, // メタデータ不要
    'update_post_term_cache' => false, // ターム情報不要
    'fields'                 => 'ids',  // IDのみ取得
);
$news_ids_query = new WP_Query( $args );
```
