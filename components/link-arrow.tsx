import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function LinkArrow({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <Link className={`link-arrow${inverse ? " link-arrow-inverse" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
    </Link>
  );
}
