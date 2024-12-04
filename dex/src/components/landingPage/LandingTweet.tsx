import styles from "../../css/LandingPage.module.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { TwitterTweetEmbed } from "react-twitter-embed";

const LandingTweet = () => {
  const handleReadMore = () => {
    window.open("https://twitter.com/FinanceXS", "_blank");
  };
  return (
    <div className={styles.tweetSection}>
      <div className={styles.topSec}>
        <h5>Check out our latest alpha</h5>
        <h5 className={styles.readMore} onClick={handleReadMore}>
          Read more on our Tweet{" "}
          <ArrowForwardIcon fontSize="large" className={styles.muiArrow} />
        </h5>
      </div>
      <h1>Tweet</h1>
      <div className={styles.tweets}>
        <div className={styles.tweetsEmbed}>
          <TwitterTweetEmbed
            tweetId="1505433297865912320"
            options={{
              cards: "hidden",
            }}
            placeholder={"loading..."}
          />
        </div>
        <div className={styles.tweetsEmbed}>
          <TwitterTweetEmbed
            tweetId="1630905815526961152"
            placeholder={"loading..."}
            options={{
              cards: "hidden",
            }}
          />
        </div>
        <div className={styles.tweetsEmbed}>
          <TwitterTweetEmbed
            tweetId="1630880519021006848"
            placeholder={"loading..."}
            options={{
              cards: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingTweet;
