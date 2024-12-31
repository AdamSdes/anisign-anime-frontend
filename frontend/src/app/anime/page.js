import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Footer from "@/shared/ui/Footer/Footer";
import AnimeDetails from "@/widgets/AnimeDetails/AnimeDetails";
import ImageGallery from "@/widgets/AnimeDetails/ImageGallery";
import RelatedAnime from "@/widgets/AnimeDetails/RelatedAnime";
import VideoPlayer from "@/widgets/AnimeDetails/VideoPlayer";
import Discussion from "@/widgets/AnimeDetails/Discussion";

const Page = () => {
    return (
        <>
            <Header/>
            <Report/>
            <AnimeDetails/>
            <ImageGallery screenshots={anime.screenshots} />
            <RelatedAnime/>
            <VideoPlayer/>
            <Discussion/>
        </>
    );
};

export default Page;