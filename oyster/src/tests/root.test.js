import React from "react";

import Root from "components/root";
import Header from "components/header";
import Main from "components/main";

describe("Root", () => {
  it("loads the Main component", () => {
    const root = shallow(<Root />);
    expect(root.find(Main).length).toEqual(1);
  });

  it("loads the Header component", () => {
    const root = shallow(<Root />);
    expect(root.find(Header).length).toEqual(1);
  });
});
