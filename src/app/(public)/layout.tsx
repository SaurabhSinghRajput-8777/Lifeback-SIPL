import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col min-h-screen relative z-0">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
