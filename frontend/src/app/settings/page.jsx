'use client';
import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Settings from "@/widgets/Settings/Settings";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Report />
      <Settings />
    </main>
  );
}
