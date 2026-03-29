"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BarChart2, Map, Zap, MessageCircle } from "lucide-react";

const nav = [
  { href: "/analyze", label: "Analyze", icon: Zap },
  { href: "/compare", label: "Compare", icon: BarChart2 },
  { href: "/routes", label: "Route Planner", icon: Map },
  { href: "/chat", label: "AI Chat", icon: MessageCircle },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(30,41,59,0.5)",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "#6366f1",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles style={{ width: 16, height: 16, color: "white" }} />
          </div>
          <span
            style={{ fontWeight: 700, color: "white", fontSize: "1.125rem" }}
          >
            SwiftVisa
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  background: active ? "rgba(99,102,241,0.15)" : "transparent",
                  color: active ? "#a5b4fc" : "#94a3b8",
                }}
              >
                <Icon style={{ width: 14, height: 14 }} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
