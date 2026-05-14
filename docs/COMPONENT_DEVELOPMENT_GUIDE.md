# コンポーネント開発ガイドライン

## 概要

このドキュメントでは、Mieru-CACAO フロントエンドアプリケーションにおけるReactコンポーネントの開発ガイドラインを定義します。

## 目次

1. [コンポーネントの分類](#コンポーネントの分類)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [ファイル命名規則](#ファイル命名規則)
4. [コンポーネント設計原則](#コンポーネント設計原則)
5. [UIコンポーネントの実装](#uiコンポーネントの実装)
6. [レイアウトコンポーネントの実装](#レイアウトコンポーネントの実装)
7. [ページコンポーネントの実装](#ページコンポーネントの実装)
8. [状態管理](#状態管理)
9. [スタイリング](#スタイリング)
10. [テストの書き方](#テストの書き方)
11. [Storybookストーリーの作成](#storybookストーリーの作成)
12. [アクセシビリティ](#アクセシビリティ)

---

## コンポーネントの分類

### 1. UIコンポーネント (`src/components/ui/`)

**目的**: 再利用可能な基本UIコンポーネント

**特徴**:

- アプリケーションロジックを持たない
- プロパティによって完全に制御される
- Base UI + Tailwind CSSで実装
- 高いアクセシビリティ
- 完全にテストされている
- Storybookストーリーが必須

**例**: Button, Input, Select, Modal, Toast

### 2. レイアウトコンポーネント (`src/components/layouts/`)

**目的**: ページ構造を定義するコンポーネント

**特徴**:

- ページ全体の構造を提供
- 共通のヘッダー、フッター、ナビゲーション
- 認証状態に応じた表示制御
- レスポンシブデザイン

**例**: CommonLayout, Header, NavigationBar

### 3. フィーチャーコンポーネント (`src/components/pages/`)

**目的**: ページ固有の機能に特化したコンポーネント

**特徴**:

- ビジネスロジックを含む
- 複数のUIコンポーネントを組み合わせる
- 状態管理 (Zustand) と連携
- API通信を含む場合がある

**例**: LoginForm, UserList, TraceabilitySearch

## ディレクトリ構造

```
src/components/
├── ui/                          # 基本UIコンポーネント
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   ├── Input.tsx
│   ├── Input.test.tsx
│   ├── Input.stories.tsx
│   └── index.ts                 # エクスポート集約
│
├── layouts/                      # レイアウトコンポーネント
│   ├── CommonLayout.tsx
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.test.tsx
│   └── NavigationBar/
│       ├── NavigationBar.tsx
│       └── NavigationBar.test.tsx
│
└── pages/                    # ページコンポーネント (将来実装)
    ├── auth/
    │   ├── LoginForm.tsx
    │   └── LoginForm.test.tsx
    └── user/
        ├── UserList.tsx
        └── UserList.test.tsx
```

---

## ファイル命名規則

### コンポーネントファイル

- **PascalCase** を使用: `Button.tsx`, `CommonLayout.tsx`
- 1ファイル1コンポーネントの原則
- コンポーネント名とファイル名を一致させる

### インデックスファイル

**重要: re-exportは原則禁止**

ツリーシェイキングの問題を避けるため、`index.ts` による re-export は基本的に使用しません。
コンポーネントは直接インポートしてください。

```typescript
// ❌ 悪い例: re-export (禁止)
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';

// ❌ 悪い例: re-export からのインポート
import { Button, Input } from '@/components/ui';

// ✅ 良い例: 直接インポート
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
```

**例外: 型定義のみの re-export**

型定義のみの場合は、`type` キーワードを使用した re-export が許可されます。

```typescript
// ✅ 許可: 型のみの re-export
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
```

---

## コンポーネント設計原則

### 1. Single Responsibility Principle (単一責任の原則)

各コンポーネントは1つの責任のみを持つべきです。

```typescript
// ❌ 悪い例: 複数の責任を持つコンポーネント
function UserProfileWithSettings() {
  return (
    <>
      <UserProfile />
      <UserSettings />
      <UserNotifications />
    </>
  );
}

// ✅ 良い例: 責任を分離
function UserProfile() { /* ... */ }
function UserSettings() { /* ... */ }
function UserNotifications() { /* ... */ }
```

### 2. Props の設計

- 必須プロパティは少なく保つ
- デフォルト値を適切に設定
- TypeScript で型を厳密に定義
- オプショナルプロパティには `?` を使用

```typescript
// ✅ 良い例
interface ButtonProps {
  children: React.ReactNode; // 必須
  onClick?: () => void; // オプション
  variant?: 'primary' | 'secondary'; // オプション (デフォルトあり)
  size?: 'sm' | 'md' | 'lg'; // オプション (デフォルトあり)
  disabled?: boolean; // オプション
  type?: 'button' | 'submit' | 'reset'; // オプション
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  // ...
}
```

### 3. Composition over Inheritance (継承より合成)

コンポーネントを組み合わせて複雑な UI を構築します。

```typescript
// ✅ 良い例: 合成パターン
function Dialog({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      {children}
    </Modal>
  );
}

// 使用例
<Dialog isOpen={isOpen} onClose={handleClose}>
  <Dialog.Header>タイトル</Dialog.Header>
  <Dialog.Body>コンテンツ</Dialog.Body>
  <Dialog.Footer>
    <Button onClick={handleClose}>閉じる</Button>
  </Dialog.Footer>
</Dialog>
```

### 4. Pure Components (純粋コンポーネント)

同じプロパティで常に同じ出力を返すコンポーネントを目指します。

```typescript
// ✅ 良い例: 純粋コンポーネント
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>こんにちは、{name}さん</h1>;
}
```

---

## UIコンポーネントの実装

### テンプレート

````typescript
import React from 'react';
import { Button as BaseButton } from '@base_ui/react/Button';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * バリアント定義
 */
const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-5 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

/**
 * Props 型定義
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** ボタンのラベル */
  children: React.ReactNode;
  /** 読み込み中状態 */
  isLoading?: boolean;
}

/**
 * Buttonコンポーネント
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   クリック
 * </Button>
 * ```
 */
export function Button({
  children,
  variant,
  size,
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </BaseButton>
  );
}

Button.displayName = 'Button';
````

### 重要なポイント

1. **Base UI を使用**: アクセシビリティを確保
2. **tailwind-variants でバリアント管理**: 型安全なスタイル管理
3. **JSDoc コメント**: コンポーネントとプロパティの説明
4. **displayName 設定**: デバッグツールでの識別性向上
5. **TypeScript strict mode 対応**: 型安全性の確保

---

## レイアウトコンポーネントの実装

### CommonLayout の例

```typescript
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from './Header/Header';
import { NavigationBar } from './NavigationBar/NavigationBar';

interface CommonLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function CommonLayout({
  children,
  showNavigation = true,
}: CommonLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      {isAuthenticated && showNavigation && <NavigationBar />}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### ポイント

- 認証状態に応じた表示制御
- レスポンシブデザイン (Tailwind CSS)
- シンプルで予測可能な構造

---

## ページコンポーネントの実装

### テンプレート

```typescript
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { withAuth } from '@/lib/withAuth';
import { CommonLayout } from '@/components/Layout/CommonLayout';

function UserListPage() {
  const { t } = useTranslation('common');

  return (
    <CommonLayout>
      <h1 className="text-2xl font-bold mb-4">{t('user.list.title')}</h1>
      {/* ページコンテンツ */}
    </CommonLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'user'])),
    },
  };
};

export default withAuth(UserListPage, {
  requireAuth: true,
  allowedUserTypes: ['admin', 'standard'],
  requiredService: 'user_management',
});
```

### ポイント

1. **getServerSideProps**: SSRとi18nデータ取得
2. **withAuth HOC**: 認証保護
3. **CommonLayout**: 共通レイアウト適用
4. **useTranslation**: 国際化対応

---

## 状態管理

### ローカル状態 (useState)

コンポーネント内部のみで使用する状態。

```typescript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <Button onClick={() => setCount(count + 1)}>増加</Button>
    </div>
  );
}
```

### グローバル状態 (Zustand)

複数のコンポーネント間で共有する状態。

```typescript
// カスタムフック経由で使用
function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>ユーザー名: {user?.username}</p>
      <Button onClick={logout}>ログアウト</Button>
    </div>
  );
}
```

### フォーム状態

```typescript
function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // バリデーションとAPI呼び出し
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      {/* ... */}
    </form>
  );
}
```

---

## スタイリング

### Tailwind CSS の使用

```typescript
// ✅ 良い例: Tailwind ユーティリティクラス
<div className="flex items-center justify-between p-4 bg-white rounded shadow">
  <h2 className="text-lg font-semibold">タイトル</h2>
  <Button>アクション</Button>
</div>
```

### tailwind-variants の使用

```typescript
import { tv } from 'tailwind-variants';

const cardVariants = tv({
  base: 'rounded shadow p-4',
  variants: {
    variant: {
      default: 'bg-white',
      primary: 'bg-blue-50 border border-blue-200',
      danger: 'bg-red-50 border border-red-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Card({ variant, children }) {
  return (
    <div className={cardVariants({ variant })}>
      {children}
    </div>
  );
}
```

### レスポンシブデザイン

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* モバイル: 1列, タブレット: 2列, デスクトップ: 3列 */}
</div>
```

## アクセシビリティ

### ARIA属性

```typescript
<Button
  aria-label="ユーザーメニューを開く"
  aria-expanded={isOpen}
  aria-controls="user-menu"
>
  メニュー
</Button>
```

### キーボードナビゲーション

```typescript
function Modal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ...
}
```

### フォーカス管理

```typescript
function Dialog({ isOpen }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      {/* ... */}
    </div>
  );
}
```
