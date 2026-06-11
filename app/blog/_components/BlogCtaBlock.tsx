import Link from "next/link";

type LinkItem = { href: string; label: string };

type Props = {
  title: string;
  links: LinkItem[];
};

export function BlogCtaBlock({ title, links }: Props) {
  const visible = links.slice(0, 3);
  return (
    <aside
      className="card-flat my-10 border border-white/[0.08] bg-white/[0.02] px-5 py-6 md:px-8"
      aria-label={title}
    >
      <h3 className="font-mono text-[11px] tracking-wide text-white/45">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-3">
        {visible.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="card-flat interactive-subtle inline-block px-4 py-2.5 text-sm text-white/75 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
