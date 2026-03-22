"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MemberSidebar from "@/components/member/MemberSidebar";
import WaveGridBg from "@/components/wave-grid-bg";

export default function EspaceMembreLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const session = localStorage.getItem("gm_member_session");
    if (!session && pathname !== "/connexion") {
      router.push("/connexion");
    } else {
      setReady(true);
      try {
        const notifs = JSON.parse(localStorage.getItem("gm_notifications") || "[]");
        const count = notifs.filter((n: { read: boolean }) => !n.read).length;
        setUnread(count > 0 ? count : 3);
      } catch { setUnread(3); }
    }
  }, [pathname, router]);

  if (!ready) return (
    <div className="flex h-screen items-center justify-center" style={{ background: "#03071A" }}>
      <div className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: "#60A5FA", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: "#03071A" }}>
      <WaveGridBg />
      <div className="relative z-10 flex w-full h-full">
        <MemberSidebar unreadCount={unread} />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
