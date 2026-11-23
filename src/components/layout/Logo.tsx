import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({
  className,
  href = "/",
  size = "header",
}: {
  className?: string;
  href?: string;
  size?: "header" | "compact";
}) {
  const width = size === "header" ? "w-[140px] sm:w-[170px]" : "w-[130px]";

  return (
    <Link
      href={href}
      className={`inline-flex min-w-0 shrink-0 items-center ${width} ${className ?? ""}`}
      aria-label={`${site.name}, home`}
    >
      <span className="relative block aspect-[2.85/1] w-full">
        <Image
          src="/Keian_Luxandor_logo2.png"
          alt=""
          fill
          sizes={size === "header" ? "(min-width: 640px) 170px, 140px" : "130px"}
          className="object-cover"
        />
      </span>
    </Link>
  );
}
