export default function Layout({ children }) {
  return (
    <div className="dashboard">
      <nav>Sidebar</nav>
      <main>{children}</main>
    </div>
  );
}
