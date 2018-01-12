import React from "react";
import Main from "components/main";
import Logo from "components/shared/logo";

describe("<Main />", () => {
  it("renders welcome text", () => {
    const app = shallow(<Main />);

    expect(app.text()).toContain("Welcome to Oyster");
  });

  it("renders the <Logo /> component", () => {
    const app = shallow(<Main />);

    expect(app.find(Logo)).toHaveLength(1);
  });
});
