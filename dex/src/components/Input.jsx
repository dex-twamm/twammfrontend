const Input = ({ id, onChange, value }) => {
  return (
    <div className="textInput">
      <input
        className="textField"
        type="text"
        placeholder="0.0"
        value={input}
        onChange={(e) => {
          e.target.value;
        }}
      />
      {!selectToken ? (
        <button className="btn token-select" onClick={handleDisplay}>
          <span className="spn-select-token">
            <div>
              <span className="select-container">Select a token</span>
            </div>
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sc-33m4yg-8 jsUfgJ"
            >
              <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
            </svg>
          </span>
        </button>
      ) : (
        <button className="btn currency-select" onClick={handleDisplay} id={id}>
          <span className="spn-currency">
            <div className="currency">
              <img
                className="tokenImage"
                src={id === 1 ? tokenA.image : tokenB.image}
                style={{ marginRight: "0.5rem" }}
                alt="token-image"
              />
              <span className="token-container">
                {id === 1 ? tokenA.symbol : tokenB.symbol}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sc-w04zhs-16 lfEMTx"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </span>
        </button>
      )}
    </div>
  );
};

export default Input;
