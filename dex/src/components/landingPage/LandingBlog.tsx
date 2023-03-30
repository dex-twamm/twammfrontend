import styles from "../../css/LandingPage.module.css";

const LandingBlog = () => {
  return (
    <div className={styles.blogSection}>
      <div className={styles.topSec}>
        <h5>Check out our latest alpha</h5>
        <h5>Read more on our blog </h5>
      </div>
      <h1>Blog</h1>
      <div className={styles.blogContents}>
        <div className={styles.blogItems}>
          <img src="" alt="" />
          <div className={styles.blogInfos}>
            <span className={styles.date}>23 Nov 2022</span>
            <p className={styles.blogTopic}></p>
            <p className={styles.blogDetails}></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingBlog;
