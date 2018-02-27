import analytics from "analytics.js";

global.analytics = analytics;

analytics.track("EDMUND TESTING", {
  plan: "TESTING"
});
export default analytics;
