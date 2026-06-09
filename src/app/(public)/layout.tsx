import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
