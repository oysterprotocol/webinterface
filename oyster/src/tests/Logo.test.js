import React from "react";
import Logo from "../components/shared/Logo";

describe("<Logo />", () => {
  it("renders an image", () => {
    jest.mock("../assets/images/logo.png", () => jest.fn());
    const logo = shallow(<Logo />);

    expect(toJson(logo)).toMatchSnapshot();
  });
});
