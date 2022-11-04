import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ChatBubbleOutlineTwoToneIcon from "@mui/icons-material/ChatBubbleOutlineTwoTone";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FreeBreakfastOutlinedIcon from "@mui/icons-material/FreeBreakfastOutlined";
import "./navbarDropdown.css";

const NavOptionDropdwon = () => {
  return (
    <>
      <div className="container">
        <div
          className="subcls"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              fontSize: "18px",
              color: "#565A69",
              fontFamily: "Open Sans",
            }}
          >
            <p>About</p>
            <InfoOutlinedIcon sx={{ fontSize: 19, color: "#565A69" }} />
          </div>
          {/* <div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							cursor: 'pointer',
							color: '#565A69',
							fontSize: '18px',
							fontFamily:'Open Sans'

						}}
					>
						<p>Help Center</p>
						<HelpOutlineOutlinedIcon
							sx={{ fontSize:19, color: '#565A69' }}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							cursor: 'pointer',
							color: '#565A69',
							fontSize: '18px',
							fontFamily:'Open Sans'

						}}
					>
						<p>Request Features</p>
						<FreeBreakfastOutlinedIcon
							sx={{ fontSize:19, color: '#565A69' }}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							cursor: 'pointer',
							color: '#565A69',
							fontSize: '18px',
							fontFamily:'Open Sans'

						}}
					>
						<p>Discord</p>
						<ChatBubbleOutlineTwoToneIcon
							sx={{ fontSize:19, color: '#565A69' }}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							cursor: 'pointer',
							color: '#565A69',
							fontSize:'18px',
							fontFamily:'Open Sans'

						}}
					>
						<p>Language</p>
						<LanguageOutlinedIcon
							sx={{ fontSize:19, color: '#565A69' }}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							cursor: 'pointer',
							color: '#565A69',
							fontSize:'18px',
							fontFamily:'Open Sans'

						}}
					>
						<p>Light theme</p>
						<DarkModeOutlinedIcon
							sx={{ fontSize:19, color: '#565A69' }}
						/>
					</div>

					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							cursor: 'pointer',
							color: '#565A69',
							fontFamily:'Open Sans',
							fontSize:'18px',
						}}
					>
						<p>Docs</p>
						<ImportContactsOutlinedIcon
							sx={{ fontSize:19, color: '#565A69' }}
						/>
					</div> */}
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              color: "#565A69",
              fontSize: "18px",
              fontFamily: "Open Sans",
            }}
          >
            <p>Legal & Privacy</p>
            <DescriptionOutlinedIcon
              sx={{
                fontSize: 19,
                color: "#565A69",
                opacity: 0.8,
                background: "white",
              }}
            />
          </div> */}
        </div>
        {/* <button className="btn">Claim UNI</button> */}
      </div>
    </>
  );
};

export default NavOptionDropdwon;
