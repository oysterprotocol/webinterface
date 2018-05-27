describe("Oyster file upload and download", () => {
  context("Dummy treasure", () => {
    it("should upload and download file", () => {
      // TODO: Run tests against production version.

      // Goes to upload form
      cy.visit("http://0.0.0.0:3000/");
      cy.get("#upload-btn").click();
      cy.location().should(location => {
        expect(location.pathname).to.eq("/upload-form");
      });

      // Uploads image and submit
      cy.uploadFile("#upload-input", "ditto.png");
      cy.get("#start-upload-btn").click();

      // Starts Polling
      cy.location().should(location => {
        expect(location.pathname).to.eq("/upload-started");
      });

      // Success (60s timeout)
      cy.location("pathname", { timeout: 60000 }).should(path => {
        expect(path).to.eq("/upload-complete");
      });

      let handle; // TODO: Use this for webnode tests
      cy
        .get("#oyster-handle")
        .invoke("text")
        .then(h => {
          handle = h;
          expect(handle).to.not.be.null;
        });
    });
  });
});
