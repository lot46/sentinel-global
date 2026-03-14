import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AppShellProps {
  appName: string;
  children: ReactNode;
  accentVar?: string;
}

const AppShell = ({ appName, children, accentVar }: AppShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Sentinel Global
          </Link>
          <span className="text-border">/</span>
          <span className="font-semibold tracking-tight">{appName}</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
        Sentinel Global — Écosystème citoyen
      </footer>
    </div>
  );
};

export default AppShell;
