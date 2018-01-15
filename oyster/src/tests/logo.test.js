import React from "react";
import Logo from "components/shared/logo";

describe("<Logo />", () => {
  it("renders an image", () => {
    const logo = shallow(<Logo />);

    expect(logo.find("img").prop("src")).toEqual("blahh");
  });
});
