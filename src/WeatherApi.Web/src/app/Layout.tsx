import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navigation = [{ to: '/regnkart', label: 'Regnkart' }];

export function Layout() {
  return (
    <div className="app-layout">
      <header>
        <nav aria-label="Hovedmeny">
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <Suspense fallback={<p role="status">Laster…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
