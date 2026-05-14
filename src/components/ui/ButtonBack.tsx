import Link from 'next/link';

interface ButtonBackProps {
  text: string;
  href: string;
}

export const ButtonBack = ({ text, href }: ButtonBackProps) => {
  return (
    <Link
      href={href}
      className="text-blue-500 hover:underline mt-10 inline-block"
    >
      ←{text}
    </Link>
  );
};
