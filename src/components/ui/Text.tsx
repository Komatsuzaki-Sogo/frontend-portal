import { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  className?: string;
}

export const Text = ({ children, className = '' }: TextProps) => {
  return <p className={`mt-4 ${className}`}>{children}</p>;
};
