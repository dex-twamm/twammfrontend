import { Avatar, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import React, { Dispatch, SetStateAction } from "react";
import { TokenType } from "../../utils/pool";
import wStyles from "../../css/WithdrawLiquidity.module.css";

interface PropTypes {
  selectedTokenPair: TokenType[];
  selectValue: number;
  setSelectValue: Dispatch<SetStateAction<number>>;
}

const WithdrawLiquiditySelect = ({
  selectedTokenPair,
  selectValue,
  setSelectValue,
}: PropTypes) => {
  return (
    <Select
      className={wStyles.selectBox}
      inputProps={{ "aria-label": "Without label" }}
      value={selectValue}
      onChange={(e) => {
        setSelectValue(+e.target.value);
      }}
      variant="outlined"
      sx={{
        outline: "none",
        width: selectValue === 1 ? "45%" : "35%",
      }}
    >
      <MenuItem value={1}>
        <div className={wStyles.menuItems}>
          <Box className={wStyles.styledBoxFive}>
            <Avatar
              className={wStyles.styledAvatarOne}
              alt="TestV4"
              src={selectedTokenPair[0].logo}
              sx={{ width: "25px", height: "25px" }}
            />
            <Avatar
              className={wStyles.styledAvatarTwo}
              sx={{ width: "25px", height: "25px" }}
              alt="Faucet"
              src={selectedTokenPair[1].logo}
            />
          </Box>
          <span className={wStyles.optionText}>All tokens</span>
        </div>
      </MenuItem>
      {selectedTokenPair.map((itm: TokenType, index: number) => (
        <MenuItem value={index + 2} key={index}>
          <div className={wStyles.menuItems}>
            <img src={itm?.logo} alt="" height={25} width={25} />
            <span className={wStyles.optionText}>{itm?.name}</span>
          </div>
        </MenuItem>
      ))}
    </Select>
  );
};

export default WithdrawLiquiditySelect;
