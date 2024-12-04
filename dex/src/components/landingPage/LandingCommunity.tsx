import styles from "../../css/LandingPage.module.css";
import discord from "../../images/discord.svg";

const LandingCommunity = () => {
  const handleJoinDiscord = () => {
    window.open("https://discord.gg/N2rbZwCNhq", "_blank");
  };
  return (
    <div className={styles.communitySection}>
      <h1>Join the Community</h1>
      <p>
        Learn more about Longswap Protocol, get support, and have your say in
        shaping the future of decentralized finance.
      </p>
      <button onClick={handleJoinDiscord}>
        <img className={styles.discord} src={discord} alt="img" /> Join Discord{" "}
      </button>
    </div>
  );
};

export default LandingCommunity;
