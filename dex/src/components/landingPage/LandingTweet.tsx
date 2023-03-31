import styles from "../../css/LandingPage.module.css";
import tweetCard from "../../images/tweetCard.png";
import tweetCardOne from "../../images/tweetCardOne.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LandingTweet = () => {
  return (
    <div className={styles.tweetSection}>
      <div className={styles.topSec}>
        <h5>Check out our latest alpha</h5>
        <h5>
          Read more on our Tweet{" "}
          <ArrowForwardIcon fontSize="large" className={styles.muiArrow} />
        </h5>
      </div>
      <h1>Tweet</h1>
      <div className={styles.tweets}>
        <img src={tweetCard} alt="tweetImage" />
        <div className={styles.tweetCards}>
          <img src={tweetCardOne} alt="img" />
          <img src={tweetCardOne} alt="img" />
        </div>
        <div className={styles.tweetCards}>
          <img src={tweetCardOne} alt="img" />
          <img src={tweetCardOne} alt="img" />
        </div>
      </div>
    </div>
  );
};

export default LandingTweet;
