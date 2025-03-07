"use client";
import { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  text: string;
  href: string;
}

export default function ButtonRedirect({
  text,
  href,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();
  const onClickClose = () => {
    router.push(href);
  };
  return (
    <>
      <button className="text-neutral-500 " onClick={onClickClose} {...rest}>
        <span>{text}</span>
      </button>
    </>
  );
}
