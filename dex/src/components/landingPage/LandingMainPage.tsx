import LandingBalancer from "./LandingBalancer";
import LandingBlog from "./LandingBlog";
import LandingCommunity from "./LandingCommunity";
import LandingCover from "./LandingCover";
import LandingFooter from "./LandingFooter";
import LandingNavbar from "./LandingNavbar";
import LandingTechnology from "./LandingTechnology";
import LandingThesis from "./LandingThesis";
import LandingTraders from "./LandingTraders";
import LandingTweet from "./LandingTweet";
import LandingVideo from "./LandingVideo";

const LandingMainPage = () => {
  return (
    <div>
      <LandingNavbar />
      <LandingCover />
      <LandingVideo />
      <LandingThesis />
      <LandingTraders />
      <LandingTechnology />
      <LandingBlog />
      <LandingBalancer />
      <LandingTweet />
      <LandingCommunity />
      <LandingFooter />
    </div>
  );
};

export default LandingMainPage;
