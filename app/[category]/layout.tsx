export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="category-full-bleed">
      {children}
    </div>
  );
}
