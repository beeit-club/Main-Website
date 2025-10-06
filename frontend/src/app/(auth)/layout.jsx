export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-lg shadow-black/5 px-8 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
