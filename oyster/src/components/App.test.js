import React from "react";
import { shallow } from "enzyme";

import App from "components/App";

test("loads the header", () => {
  const app = shallow(<App />);

  expect(app.text()).toContain("Welcome to Oyster");
});
