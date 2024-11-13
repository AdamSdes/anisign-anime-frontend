import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Footer from "@/shared/ui/Footer/Footer";
import CommentsList from "@/widgets/CommentsList/CommentsList";
import FilterComments from "@/featers/FiltersComments/FilterComments";

const Page = () => {
    return (
        <>
            <Header/>
            <Report/>
            <main className="anim-test">
                <FilterComments/>
                <CommentsList/>
            </main>
        </>

    );
};

export default Page;