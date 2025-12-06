import React from "react";
import TabBar from "../components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="pb-20">{children}</div>
      <TabBar />
    </div>
  );
}
