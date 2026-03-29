import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import MainLayout from "@/components/shared/MainLayout";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  );
}
