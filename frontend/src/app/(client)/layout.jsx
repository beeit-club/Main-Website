import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ScrollToTop } from "@/components/common/ScrollToTop";

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <ScrollToTop />
      <Footer />
    </>
  );
}
