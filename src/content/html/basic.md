---
title: 'HTMLの基本原則（文書構造の土台）'

publishDate: 2026-05-28

category: 'html'

order: 1
---
- [ドキュメントタイプ宣言（DOCTYPE）](#ドキュメントタイプ宣言doctype)
- [言語指定（lang属性）](#言語指定lang属性)
- [文字コード（charset）の指定](#文字コードcharsetの指定)
- [表示領域の最適化（viewportの設定）](#表示領域の最適化viewportの設定)
- [ページタイトル（title）](#ページタイトルtitle)
- [ページの説明文（description）](#ページの説明文description)
- [OGP（Open Graph Protocol）](#ogpopen-graph-protocol)
- [構造化データ：パンくずリスト（BreadcrumbList）](#構造化データパンくずリストbreadcrumblist)
- [コードの記述](#コードの記述)
- [閉じタグの省略禁止](#閉じタグの省略禁止)
- [空要素（セルフクロージングタグ）の扱い](#空要素セルフクロージングタグの扱い)
- [パス表記](#パス表記)

## ドキュメントタイプ宣言（DOCTYPE）

ブラウザに対して「このファイルは最新のHTML規格（HTML5）で書かれている」と正しく伝えるため、ファイルの1行目に必ず以下のドキュメントタイプ宣言を記述してください。

この宣言がない場合、あるいは古い形式で書かれている場合、ブラウザは「過去の古いWebサイトだ」と判断し、互換モード（Quirks Mode）という特殊な状態でページを描画してしまいます。その結果、最新のCSSが正しく効かなくなったり、ブラウザ間で表示が大きく崩れたりする原因になります。

```html
<!DOCTYPE html>
<html>
  ...
</html>
```

## 言語指定（lang属性）

このWebページが「何語で書かれているか」を明確にするため、`<html>` タグに必ず `lang`属性を指定してください。当社の主要な案件（日本語サイト）では `ja`を指定します。

- 多言語サイトなど、日本語以外の言語でページを制作する場合は、その言語に応じたコード（例: 英語なら `lang="en"`）を適切に指定してください。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    ...
  </head>
</html>
```

## 文字コード（charset）の指定

Webページで使用するテキストのエンコーディング（文字コード）をブラウザへ正しく伝えるため、`<head>` タグの先頭に必ず文字コードの指定（`<meta charset="UTF-8">`）を記述してください。

* **文字コードは `UTF-8` を必須（MUST）とします。**
* `<meta charset="UTF-8">` は、`<head>` タグを開いた直後（最優先で1番上）に記述してください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
</head>
  ...
</html>
```

## 表示領域の最適化（viewportの設定）

スマートフォンやタブレットなどのモバイル端末で、Webページが意図した通りのサイズ（レスポンシブ）で正しく表示されるようにするため、`<head>` タグ内に必ず `viewport`（ビューポート）のメタタグを記述してください。

- **`<head>` タグ内のなるべく上部に、以下の `<meta name="viewport" ...>` を記述する。**
- 値は原則として `width=device-width, initial-scale=1.0` を標準とします。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ページタイトル</title>
  </head>
  ...
</html>
```

## ページタイトル（title）

検索結果の画面、ブラウザのタブ、ブックマーク（お気に入り）登録時、およびSNSでシェアされた際の標準タイトルとして表示される、すべてのWebページにおいて最重要なテキスト要素です。検索エンジン（SEO）のクローラーがページ内容を理解する最大のシグナルとなるため、ページごとに最適な`title`を適切に記述してください。

```html
<title>○○</title>

<title>□□ | ○○</title>
```

## ページの説明文（description）

検索結果のタイトルの下に表示される、ページの概要を説明する文章（スニペット）です。検索順位に直接影響するわけではありませんが、検索したユーザーが「このページをクリックするかどうか」を決めるクリック率（CTR）を左右する重要な要素となるため、ページの内容に沿った`description`を適切に記述してください。

```html
<meta name="description" content="text text text text" />
```

## OGP（Open Graph Protocol）

Facebook、LINE、Slack、ビジネスチャットなどでWebページのURLが共有された際、リッチなカード形式（タイトル・説明文・アイキャッチ画像など）で魅力的に表示させるための共通のメタ規格です。SNS経由の流入数・認知度に大きな影響を与えるため、すべてのページにおいて`OGP`を適切に記述してください

- `property` 属性を使って、それぞれの要素を定義します。
- OGP内に記述するURLや画像パスは、外部のSNSサーバーが読み取りにくるため、**すべて絶対パス（`https://...`）**で記述してください。

### 各プロパティの詳細

| プロパティ名                 | 設定ルール・文字数目安                                                                                                    |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **`og:url`**         | ページの正規化URL。`canonical` タグに指定したものと全く同じ絶対パスを記述します。                                       |
| **`og:type`**        | ページの性質。トップページやポータル全体の親は `website`、下層の個別記事やブログは `article` を指定。                 |
| **`og:title`**       | OGP用のタイトル。基本は `<title>` と同じでOKですが、SNSの文字制限を考慮して社名などを省き、短く目立たせても構いません。 |
| **`og:description`** | OGP用の説明文。SNSの仕様に合わせ、`<meta name="description">` より短めの**60文字〜80文字程度**に凝縮します。      |
| **`og:site_name`**   | サイト全体の名前（ブランド名・企業名・メディア名など）を指定します。                                                      |
| **`og:image`**       | シェア時に表示される画像（OGP画像）の絶対URL。推奨サイズは**横1200px × 縦630px（比率 1.91:1）**。                  |
| **`og:locale`**      | ターゲットとする言語と地域。国内向けのサイトであれば `ja_JP` で固定します。                                             |

```html
<meta property="og:url" content="https://example.com/" />
<meta property="og:type" content="website" />
<meta property="og:title" content="○○" />
<meta property="og:description" content="text text text text" />
<meta property="og:site_name" content="○○" />
<meta
  property="og:image"
  content="https://example.com/assets/img/common/ogp.jpg"
/>
<meta property="og:locale" content="ja_JP" />
```

## 構造化データ：パンくずリスト（BreadcrumbList）

パンくずリストの構造化データは、Webサイト内のWebページの位置（階層構造）を検索エンジンへ正確に伝えるためのマークアップです。
これを実装することで、Googleなどの検索結果に表示されるURL部分が、サイトの階層に合わせた綺麗なテキスト（例: `ホーム > HTML一覧 > ダミータイトル`）で表示され、ユーザーのクリック率（CTR）向上が期待できます。

* **記述方式：** `JSON-LD` 方式を採用し、`<head>` 内または `</body>` 閉じタグの直前に記述します。
* **URLの指定（MUST）：** `item` プロパティに指定するURLは、必ずプロトコル（`https://`）から始まる**絶対パス**で記述してください。
* **位置の連番（MUST）：** `position` プロパティは、トップページ（ホーム）を `1` とし、下層にいくにつれて `2`, `3` と1ずつ増える連番で記述します。
* **画面表示との一致（MUST）：** 構造化データ内の `name`（ページ名）や階層順は、**実際の画面上に表示されているパンくずリストの内容と完全に一致**させてください。

### 1. パンくずリスト（BreadcrumbList）
ユーザーがサイト内のどこにいるかを示す階層構造を検索エンジンに伝えます。検索結果のURL表示部分が綺麗に日本語化されます。

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "HTML一覧",
      "item": "https://example.com/html/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "ダミータイトル",
      "item": "https://example.com/html/web-design/dummy"
    }
  ]
}
</script>
```

## コードの記述

HTMLの要素名（タグ名）および属性名は、すべて**小文字**で統一します。
HTMLの属性に指定する値は、必ずダブルクォーテーション（`""`）で囲みます。

- タグ（`<div>`, `<a>` など）や属性（`href`, `class` など）に大文字を混ぜてはいけません。

```html
<div class="main-content">
  <a href="https://example.com">リンク</a>
</div>
```

## 閉じタグの省略禁止

HTML5の仕様（W3C/WHATWG規格）上、一部の要素（`<li>`, `<td>`, `<p>` など）は、次に別の特定のタグが続く場合に閉じタグを省略することが認められています。しかし、当社の開発においては **「すべてのペアタグの閉じタグを絶対に省略しない（MUST）」**を共通ルールとします。

- 要素を新しく開いた（例: `<li>`）場合は、必ず対応する閉じタグ（例: `</li>`）を記述して、要素の範囲を明確に閉じます。
- 複雑な表組み（`<table>`）やリスト、ネスト（入れ子）が深いレイアウトでは、特に徹底してください。

```html
<ul>
  <li>トップページ</li>
  <li>サービス紹介</li>
  <li>会社概要</li>
</ul>

<table>
  <tr>
    <td>項目A</td>
    <td>データ1</td>
  </tr>
</table>
```

## 空要素（セルフクロージングタグ）の扱い

`<img>` や `<br>`、`<input>`、`<meta>` のように、中にテキストや子要素を持たない（閉じタグ自体が存在しない）要素を「空要素」と呼びます。
これらは歴史的な経緯（HTML4/XHTML/HTML5の過渡期）により複数の書き方が存在しますが、コードの一貫性を保つため、当社では **末尾のスラッシュ（`/`）を「入れない」表記に統一（MUST）**します。

- 空要素の末尾には、半角スペースやスラッシュ（`/`）を付けず、そのまま `>` で閉じます。
- `<img>` タグのほか、実務で頻出する `<br>`, `<input>`, `<meta>`, `<link>` などすべてに適用します。

```html
<img src="assets/img/hero.jpg" alt="メインビジュアル">
<br>
<input type="email" name="email" id="email">
```

# パス表記

サイト内のリソースへのパス表記はルートパス（`/`から始まる表記）で記述してください。

```html
<script type="module" src="/shared/js/main.js"></script>
<link rel="stylesheet" href="/shared/css/style.css">
<img src="/subpage/example.png" alt="">
<a href="/subpage/example">リンク</a>
```