import Header from "@/components/layout/Header";

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
