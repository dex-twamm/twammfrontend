import styles from "../../css/LandingPage.module.css";

const LandingCover = () => {
  return (
    <div className={styles.coverContainer}>
      <h1>A new kind of AMM pools</h1>
      <h5>Execute large orders with smaller slippage with out TWAMM pools</h5>
      <button className={styles.launchBtn}>Launch the App</button>
    </div>
  );
};

export default LandingCover;
