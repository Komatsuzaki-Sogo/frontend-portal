---
title: 'CSS記述のガイドライン'

publishDate: 2026-05-29


category: 'css'

order: 1
---
- [IDセレクター](#idセレクター)
- [タイプセレクター](#タイプセレクター)
- [スタイル用クラスとJS用クラスの使い分け](#スタイル用クラスとJS用クラスの使い分け)
- [命名規則](#命名規則)
- [レスポンシブルール](#レスポンシブルール)
- [variable管理](#variable管理)

## IDセレクター

`id`属性は、ページ全体で一意であることが期待されますが、同じページに多くのコンポーネントが含まれている場合や複数のエンジニアが作業する場合は、常に`id`属性が一意であることを保証するのが困難です。
そのため、スタイリングではIDセレクターの使用は避け、クラスセレクターを使用します。

```scss
// BAD
#title {}

// GOOD
.title {}
```

## タイプセレクター

メンテナンス性が低下するため、タイプセレクターを使用したスタイリングは禁止します。
また、パフォーマンスの理由から、必要な場合以外はクラスセレクターと一緒に要素名（タイプセレクター）を使用しないようにします。
`reset.scss` **や** `base.scss` **は共通設定を行うので、タイプセレクターは例外です。**

```scss
// BAD
ul {}

div.content {}

// GOOD
.list {}

.content {}
```

## スタイル用クラスとJS用クラスの使い分け

スタイル用で使用するクラスなのかJSで使用するクラスは責務が違うため必ず分けてください。

- スタイル用クラス: 装飾を行うためのクラス
- JS用クラス: JSのトリガーとなるまたはJSで使用するクラス

```scss
// BAD
.js-toggle__trigger {}

// GOOD
.c-toggle__trigger {}
```

## 命名規則

`BEM(MindBEMding)`を推奨しております。
BEM命名規則とは**Block**、**Element**、**Modifier**に分類して構成される規則です。

* **B：Block（ブロック）**
  * それ単体で独立して存在し、意味を持つスタンドアロンなコンポーネント（例: ボタン、カード、メニューなど）。
* **E：Element（要素）**
  * Blockを構成する内部のパーツ。Blockの外に単体で取り出すと意味をなさないもの（例: カードの画像、カードのタイトル、メニューのアイテムなど）。
* **M：Modifier（修飾子）**
  * BlockやElementの「見た目（色・サイズ）」や「状態（アクティブ・非アクティブ）」の変化・バリエーションを表すもの（例: 赤いボタン、大きなカード、アクティブ状態のメニューなど）。

### 命名ルール

- 「接頭辞」・「部位・分類」・「識別子」をハイフンケースでつなぎます。
- 「接頭辞」
  - 以下の表参照
- 「部位・分類」
  - header、footer、box、table、list、layout、button、link など
- 「識別子」
  - 識別可能なキーワード（info、bullet、notice など）や連番
    - 可能であれば目的や役割のわかるワードを採用します
    - 連番について
      - 必ず `type2`の形にする
      - 連番の「`1`は省略」「ゼロ埋めしない」（`id`連番は除く）
- 各単語はローワーキャメルケースで表記します。
- 原則、単語を「省略しない」

| 接頭辞 | 説明                                                                                        |
| :----- | :------------------------------------------------------------------------------------------ |
| .l-*   | レイアウト。ガワおよびフレーム（骨組み）にあたる部分に使用します。`<br>`例：`.l-header` |
| .c-*   | コンポーネント。コンポーネントにあたる部品に使用します。`<br>`例：`.c-box-info`                 |
| .u-*   | ユーティリティ。調整クラスに使用します。                                                    |
| .unq-* | カテゴリー、ページユニークにあたる部品に使用します。`<br>`例：`.unq-top-box`            |
| .js-*  | JSで操作する用途で使用します。                                                              |
| .is-*  | JavaScriptによる状態変化をさせる用途で使用します。                                          |

```scss
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}

.c-box-info {}
.c-box-infoType2 {}
```

## レスポンシブルール

CSS/SCSS開発においては、スマートフォン（SP）用のスタイルをベース（メディアクエリの外側）として記述し、画面幅が広くなるにつれてPC用のスタイルを上書きしていく **「モバイルファースト（`min-width`）」**のアプローチを原則標準とします。

### なぜモバイルファーストにするのか（背景）
* **コードの軽量化・シンプル化：**
  モバイル端末のレイアウトは、要素が縦一列に並ぶシンプルな構造がほとんどです。ベースをシンプルに保ち、PC特有の複雑なグリッドや横並び（`flex-direction: row` など）を大きな画面幅のときだけ追加していく方が、全体のコード量を劇的に削減できます。
* **スマホ端末の描画パフォーマンス向上：**
  スマホのブラウザがCSSを解析する際、余計なPC用のスタイルや大量のメディアクエリをスキップできるため、端末への負荷（CPU・バッテリー）を抑え、表示速度（UX）の向上につながります。

### エディアクエリの実装

```scss
// ブレークポイント
$MAJOR_BREAKPOINT: 768px;
$MINOR_BREAKPOINT: 1100px;
$HEADER_BREAKPOINT: 1024px;
$HEADER_MINOR_BREAKPOINT: 1400px;

// メディアクエリを設定
// @param {'pc' | 'sp' | 'hover'} $type       - メディアクエリのサポート範囲
// @param {Number}                $breakpoint - ブレークポイント（単位つき）
@mixin media($type: '', $breakpoint: $MAJOR_BREAKPOINT) {
  $typeMap: (
    sp: (max-width: $breakpoint - .02px),
    pc: (min-width: $breakpoint),
    hover: (any-hover: hover)
  );

  @if map-has-key($typeMap, $type) {
    @media #{inspect(map-get($typeMap, $type))} {
        @content;
      }
  } @else {
    @error '引数$typeは必須です。';
  }
}

// 使用例
.link {
  // SP用スタイル
  @include mixin.media(sp) {
    color: red;
  }

  // PC用スタイル
  @include mixin.media(pc) {
    color: blue;
  }

  // ヘッダー用BPスタイル
  @include mixin.media($type: pc, $breakpoint: $HEADER_BREAKPOINT) {
    color: green;
  }

  // 最大コンテンツ幅用スタイル
  @include mixin.media($type: pc, $breakpoint: $HEADER_MINOR_BREAKPOINT) {
    color: orange;
  }

  // ホバー
  @include mixin.media(hover) {
    &:hover {
      text-decoration: underline;
    }
  }
}
```


## variable管理

実案件では以下を参考にカスタムプロパティを用いて管理してください。

```scss
@use 'sass:color';
@use '../_base/argument' as *;
@use '../_common/mixin/' as mixin;
@use '../_common/function/' as func;

// Custom properties
// =============================================================================
:root {
  // Color Scheme
  // =============================================
  // 基本となるカラー（ほとんどの場合変更不要）
  --COLOR_BASE_DARK: #000;
  --COLOR_BASE_LIGHT: #fff;

  // このサイト固有の主要カラー
  --COLOR_BRAND_PRIMARY: #71c7d4;
  --COLOR_BRAND_SECONDARY: #757575;

  // 固有の意味を持つカラー
  --COLOR_ROLE_STRONG_DARK: #007180; // 強調
  --COLOR_ROLE_DANGER_DARK: #c00; // エラーメッセージの前景色など

  // 前景色として汎用的に使用するカラー
  --COLOR_FOREGROUND_DARK: #333;
  --COLOR_FOREGROUND_LIGHT: #fff;
  --COLOR_FOREGROUND_GRAY: #666;

  // 背景色として汎用的に使用するカラー
  --COLOR_BACKGROUND_DARK: #757575;
  --COLOR_BACKGROUND_LIGHT: #fff;
  --COLOR_BACKGROUND_GRAY: #f7f7f7;
  --COLOR_BACKGROUND_BLUE_1: #e4f4f6;
  --COLOR_BACKGROUND_BLUE_2: #d0ecf0;

  // 罫線色として汎用的に使用するカラー
  --COLOR_OUTLINE_DARK: #333;
  --COLOR_OUTLINE_GRAY: #999;
  --COLOR_OUTLINE_LIGHT: #ccc;

  // オーバーレイ
  --COLOR_BACKGROUND_OVERLAY: rgb(0 0 0 / .6);

  // Property
  // =============================================
  // font-family
  --Font_FAMILY_NOTO_SANS: 'Noto Sans JP', sans-serif;
  --Font_FAMILY_SERIF: "ヒラギノ明朝 ProN", "Hiragino Mincho ProN", "BIZ UD明朝", "BIZ UDMINCHO", "游明朝", "Yu Mincho", serif;

  // font-weight
  --FONT_WEIGHT_NORMAL: 400;
  --FONT_WEIGHT_MEDIUM: 500;
  --FONT_WEIGHT_BOLD: 700;

  // font-size
  --FONT_SIZE: #{func.px-to-rem(16)};

  // line-height
  --LINE_HEIGHT: 1.5;

  // opacity
  --OPACITY: .6;

  // box-shadow
  --BOX_SHADOW: 0 5px 6px rgb(125 125 125 / .2);

  --TEXT_SHADOW: 1px 1px 5px rgb(0 0 0 / .5);

  // transition
  --TRANSITION: .3s cubic-bezier(.25, .8, .25, 1);

  // header
  --HEADER_HEIGHT: 80px;
}

@include mixin.media(pc) {
  :root {
    // Font
    // ===========================================
    --SIZE_MODULE_MARGIN: 64px;
    --SIZE_NESTED_MODULE_MARGIN: 24px;
  }
}

@include mixin.media($type: pc, $breakpoint: $HEADER_BREAKPOINT) {
  :root {
    --HEADER_HEIGHT: 120px;
  }
}

@include mixin.media($type: pc, $breakpoint: $HEADER_MINOR_BREAKPOINT) {
  :root {
    --HEADER_HEIGHT: 90px;
  }
}
```