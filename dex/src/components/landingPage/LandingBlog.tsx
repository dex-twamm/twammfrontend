import styles from "../../css/LandingPage.module.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LandingBlog = () => {
  const handleReadMoreBlog = () => {
    window.open("https://mirror.xyz/longswap-xyz.eth", "_blank");
  };

  const handleViewBlog = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className={styles.blogSection}>
      <div className={styles.topSec}>
        <h5>Check out our latest alpha</h5>
        <h5 className={styles.readMore} onClick={handleReadMoreBlog}>
          Read more on our blog{" "}
          <ArrowForwardIcon fontSize="large" className={styles.muiArrow} />
        </h5>
      </div>
      <h1>Blog</h1>
      <div className={styles.blogContents}>
        <div className={styles.blogItems}>
          <div
            className={styles.blogOverlay}
            onClick={() =>
              handleViewBlog(
                "https://mirror.xyz/longswap-xyz.eth/Ud9CF0TyLD4dBFzeTzhrQuxXH_2PkP49RjF5BdT-t5E"
              )
            }
          >
            View Blog
          </div>
          <iframe
            src="https://mirror.xyz/longswap-xyz.eth/Ud9CF0TyLD4dBFzeTzhrQuxXH_2PkP49RjF5BdT-t5E"
            width="100%"
            height="100%"
            allowFullScreen
            title="blog"
            scrolling="no"
            id="blog-iframe"
          />
        </div>
        <div className={styles.blogItems}>
          <div
            className={styles.blogOverlay}
            onClick={() =>
              handleViewBlog("https://www.paradigm.xyz/2021/07/twamm")
            }
          >
            View Blog
          </div>
          <iframe
            src="https://www.paradigm.xyz/2021/07/twamm"
            width="100%"
            height="100%"
            allowFullScreen
            title="blog"
            scrolling="no"
            id="blog-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingBlog;
