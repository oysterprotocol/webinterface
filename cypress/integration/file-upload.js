describe("Oyster file upload and download", () => {
  context("Dummy treasure", () => {
    it("should upload and download file", () => {
      // TODO: Run tests against production version.

      // Goes to upload form
      cy.visit("http://0.0.0.0:3000/");
      cy.get("#upload-btn").click();
      cy.location("pathname").should(path => {
        expect(path).to.eq("/upload-form");
      });

      // Uploads image and submit
      cy.uploadFile("#upload-input", "ditto.png");
      cy.get("#start-upload-btn").click();

      // Payment
      cy.location("pathname").should(path => {
        expect(path).to.eq("/payment-invoice");
      });

      // Starts Polling
      cy.location("pathname").should(path => {
        expect(path).to.eq("/upload-started");
      });

      // Success (60s timeout)
      cy.location("pathname", { timeout: 60000 }).should(path => {
        expect(path).to.eq("/upload-complete");
      });

      cy
        .get("#oyster-handle")
        .invoke("text")
        .then(handle => {
          expect(handle).to.not.be.null;

          cy.visit("http://0.0.0.0:3000/download-form");
          cy.get("#download-handle-input").type(handle);
          cy.get("#download-btn").click();
        });
    });
  });
});
