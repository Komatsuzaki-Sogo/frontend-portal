import { ReactNode } from 'react';

interface H1Props {
  children: ReactNode;
  className?: string;
}

export const H1 = ({ children, className = '' }: H1Props) => {
  return (
    <h1 className={`text-3xl md:text-4xl font-bold [&+*]:mt-4! ${className}`}>
      {children}
    </h1>
  );
};
