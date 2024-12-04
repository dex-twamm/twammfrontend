import styles from "../../css/LandingPage.module.css";
import videoImage from "../../images/videoImage.png";
import imageBackdrop from "../../images/imageBackdrop.png";
import play from "../../images/play.png";

const LandingVideo = () => {
  return (
    <div className={styles.videoSection}>
      <div className={styles.images}>
        <img className={styles.videoImage} src={videoImage} alt="img" />
        <img className={styles.backDrop} src={imageBackdrop} alt="img" />
        <img className={styles.play} src={play} alt="img" />
      </div>
      <div className={styles.how}>
        <h5>How it work</h5>
        <p>We build decentralized infrastructure for fixed income</p>
      </div>
    </div>
  );
};

export default LandingVideo;
