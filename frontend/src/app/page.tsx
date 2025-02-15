import Header from "@/components/Header/Header"
import Report from "@/components/Report/Report"
import AnimeCarousel from "@/components/AnimeCarousel/AnimeCarousel"
import Calendar from "@/components/Calendar/Calendar"
import RecentComments from "@/components/Comments/RecentComments"
import Footer from "@/components/Footer/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header className="" />
      <Report className="" />
      <AnimeCarousel />
      <div className="w-full container h-[1px] bg-white/5"></div>
      <Calendar />
      <RecentComments />
      <Footer />
    </main>
  )
}
