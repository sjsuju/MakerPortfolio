import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RevealManager } from "@/components/reveal-manager";
import { ScrambleManager } from "@/components/scramble-manager";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <RevealManager />
      <ScrambleManager />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
