import React, { Component, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

/* ---------- Shows a render crash on the page instead of a blank screen ---------- */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Frontend crashed:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <pre style={{ padding: 24, color: "#b91c1c", whiteSpace: "pre-wrap" }}>
          {String(this.state.error?.stack || this.state.error)}
        </pre>
      );
    }

    return this.props.children;
  }
}

/* ---------- Layout: header + footer wrap every public route ---------- */
function SiteLayout() {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    fetch("/api/public/layout", { headers: { Accept: "application/json" } })
      .then((r) => {
        if (!r.ok) throw new Error(`/api/public/layout failed with status ${r.status}`);
        return r.json();
      })
      .then(setLayout)
      .catch((error) => {
        console.error(error); // check the browser console if the design does not show
        setLayout({ header: null, footer: null });
      });
  }, []);

  if (!layout) return <p style={{ padding: 24 }}>Loading layout…</p>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader config={layout.header} />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <SiteFooter config={layout.footer} />
    </div>
  );
}

/* ---------- Page content (empty is fine: layout still shows) ---------- */
function PageView() {
  const { pathname } = useLocation();
  const slug = pathname === "/" ? "home" : pathname.replace(/^\/+|\/+$/g, "");
  const [page, setPage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setPage(null);
    fetch(`/api/public/pages/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => !cancelled && setPage(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!page) return null;

  // TODO: replace with your page-builder renderer
 
}

function FrontendApp() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<PageView />} />
            <Route path="*" element={<PageView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Reuse the root when Vite hot-reloads this file (calling createRoot twice on one element crashes React)
const container = document.getElementById("frontend-root");
const root = container.__reactRoot ?? (container.__reactRoot = createRoot(container));

root.render(<FrontendApp />);
