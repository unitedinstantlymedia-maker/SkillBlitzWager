import { BottomNav } from "./BottomNav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <div className="flex-1 pb-20 container mx-auto max-w-md px-4 pt-6">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
