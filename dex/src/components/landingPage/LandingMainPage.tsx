import LandingBlog from "./LandingBlog";
import LandingCover from "./LandingCover";
import LandingNavbar from "./LandingNavbar";
import LandingTechnology from "./LandingTechnology";
import LandingThesis from "./LandingThesis";
import LandingTraders from "./LandingTraders";
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
    </div>
  );
};

export default LandingMainPage;
