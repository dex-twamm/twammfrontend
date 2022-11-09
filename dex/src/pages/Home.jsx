import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate("/swap");
  };

  return (
    <div className={styles.container}>
      <div className={styles.navSection}>
        <div className={styles.company}>
          <img src="/main_logo.png" alt="logo" />
          <Typography
            className={styles.companyName}
            sx={{
              fontFamily: "Futura",
              fontWeight: "700",
              fontSize: "24px",
              letterSpacing: "0.4px",
              color: "#000000",
            }}
          >
            Longswap
          </Typography>
        </div>
        <div className={styles.midRightSection}>
          <div className={styles.midSection}>
            <Link className={styles.link} to="/">
              How it work
            </Link>
            <Link className={styles.link} to="/">
              Loyalty program
            </Link>
            <Link className={styles.link} to="/">
              FAQ
            </Link>
            <Link className={styles.link} to="/">
              Contacts
            </Link>
          </div>
          <div className={styles.rightSection}>
            <button className={styles.login}>login</button>
            <button className={styles.account}>Get an account</button>
          </div>
        </div>
      </div>
      <Paper elevation={0} className={styles.paper}>
        <Grid container sx={{ borderRadius: "24px", backgroundColor: "black" }}>
          <Grid className={styles.leftGrid} item sm={8}>
            <h1 className={styles.bannerText}>Look beyond limits</h1>
            <img src="/banner_image.png" alt="banner" />
            <div className="">
              <button className={styles.launch} onClick={handleLaunch}>
                Launch App
              </button>
            </div>
          </Grid>
          <Grid className={styles.rightGrid} item sm={4}>
            <img className={styles.circles} src="/circles.png" alt="" />
            <img className={styles.design} src="/design_image.png" alt="" />
          </Grid>
          <Grid className={styles.bottomGrid} item sm={4}>
            <div className={styles.bottomLeftText}>
              Swap, earn, and build on the leading decentralized crypto trading
              protocol.
            </div>
            <div className={styles.socialMedia}>
              <img src="/linkedIn.png" alt="" />
              <img src="/discord.png" alt="" />
              <img src="/git.png" alt="" />
            </div>
          </Grid>
          <Grid className={styles.bottomGrid} item sm={4}>
            <div className={styles.bottomMiddleText}>
              The most experienced, speciallised team across the industry.
            </div>
            <div className={styles.text}>Work with us</div>
          </Grid>
          <Grid className={styles.bottomGrid} item sm={4}>
            <div className={styles.threePlus}>
              <div className="">
                <h1>300+</h1>
                <h3>Integrations</h3>
                <span>
                  Explore all <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </div>
              <img src="/spike.png" alt="" />
            </div>

            <h4 className={styles.htext}>A growing network of DeFi Apps.</h4>
            <div className={styles.bottomRightText}>
              Developers, traders, and liquidity providers participate together
              in a financial marketplace that is open and accessible to all.
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Home;
