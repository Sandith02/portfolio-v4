import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function LinkArrow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="link-arrow" href={href}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
    </Link>
  );
}
