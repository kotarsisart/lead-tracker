export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white">
      {children}
    </div>
  );
}
