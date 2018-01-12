import React from "react";
import App from "components/App";
import Logo from "components/shared/Logo";

describe("<App />", () => {
  it("renders welcome text", () => {
    const app = shallow(<App />);

    expect(app.text()).toContain("Welcome to Oyster");
  });

  it("renders the <Logo /> component", () => {
    const app = shallow(<App />);

    expect(app.find(Logo)).toHaveLength(1);
  });
});
