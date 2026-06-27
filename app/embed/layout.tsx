export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0f0d] p-2 antialiased">{children}</div>
  );
}
