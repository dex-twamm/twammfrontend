import Tabs from "../../src/components/Tabs";
import AllProviders from "../../src/providers";
import { BrowserRouter as Router } from "react-router-dom";

describe("Tab Component Testing", () => {
  beforeEach(() => {
    cy.mount(
      <AllProviders>
        <Router>
          <Tabs />
        </Router>
      </AllProviders>
    );
  });
  it("Checking if tab is working", () => {
    cy.get('[data-cy="tab-list"]').contains("Swap").click();
    cy.get('[data-cy="tab-list"]').contains("Long Term Swap").click();
    cy.get('[data-cy="tab-list"]').contains("Add Liquidity").click();
  });
});
