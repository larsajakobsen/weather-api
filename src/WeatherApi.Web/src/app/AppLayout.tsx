import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Skeleton } from "../shared/components/ui/Skeleton";

export function AppLayout() {
  return (
    <>
      <header className="app-header">
        <span className="brand">Weather</span>
      </header>
      <div className="app-body">
        <nav className="app-nav" aria-label="Hovedmeny">
          <NavLink to="/regnkart" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
            Regnkart
          </NavLink>
        </nav>
        <main>
          <div className="content">
            <Suspense fallback={<Skeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}
