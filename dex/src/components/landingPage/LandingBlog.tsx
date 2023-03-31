import styles from "../../css/LandingPage.module.css";
import blogImg from "../../images/blogImg.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LandingBlog = () => {
  return (
    <div className={styles.blogSection}>
      <div className={styles.topSec}>
        <h5>Check out our latest alpha</h5>
        <h5 className={styles.readMore}>
          Read more on our blog{" "}
          <ArrowForwardIcon fontSize="large" className={styles.muiArrow} />
        </h5>
      </div>
      <h1>Blog</h1>
      <div className={styles.blogContents}>
        <div className={styles.blogItems}>
          <img src={blogImg} alt="img" />
          <div className={styles.blogInfos}>
            <span className={styles.date}>23 Nov 2022</span>
            <p className={styles.blogTopic}>What is Interest rate swap?</p>
            <p className={styles.blogDetails}>
              Why is it essential in DeFi? An interest rate swap (IRS) is the
              exchange of fixed-rate interest flows for variable-rate interest
              flows in the same currency. It is widely used in traditional
              finance and allows you t...
              <br />
              <ArrowForwardIcon />
            </p>
          </div>
        </div>
        <div className={styles.blogItems}>
          <img src={blogImg} alt="img" />
          <div className={styles.blogInfos}>
            <span className={styles.date}>23 Nov 2022</span>
            <p className={styles.blogTopic}>What is Interest rate swap?</p>
            <p className={styles.blogDetails}>
              Why is it essential in DeFi? An interest rate swap (IRS) is the
              exchange of fixed-rate interest flows for variable-rate interest
              flows in the same currency. It is widely used in traditional
              finance and allows you t...
              <br />
              <ArrowForwardIcon />
            </p>
          </div>
        </div>
        <div className={styles.blogItems}>
          <img src={blogImg} alt="img" />
          <div className={styles.blogInfos}>
            <span className={styles.date}>23 Nov 2022</span>
            <p className={styles.blogTopic}>What is Interest rate swap?</p>
            <p className={styles.blogDetails}>
              Why is it essential in DeFi? An interest rate swap (IRS) is the
              exchange of fixed-rate interest flows for variable-rate interest
              flows in the same currency. It is widely used in traditional
              finance and allows you t...
              <br />
              <ArrowForwardIcon />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingBlog;
