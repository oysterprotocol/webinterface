describe("Oyster file upload and download", () => {
  context("Dummy treasure", () => {
    it("should upload and download file", () => {
      // TODO: Run tests against production version.

      // Goes to upload form
      cy.visit("");
      cy.get("#upload-btn").click({ force: true });
      cy.location("pathname").should(path => {
        expect(path).to.eq("/upload-form");
      });

      // Uploads image and submit
      cy.uploadFile("#upload-input", "ditto.png");
      cy.get("#start-upload-btn").click({ force: true });

      // Payment
      cy.location("pathname").should(path => {
        expect(path).to.eq("/payment-invoice");
      });

      // Payment confirmed
      cy.location("pathname", { timeout: 60000 }).should(path => {
        expect(path).to.eq("/payment-confirm");
      });

      // Upload chunks
      cy.location("pathname", { timeout: 60000 }).should(path => {
        expect(path).to.eq("/upload-started");
      });

      // attach to tangle
      cy.location("pathname", { timeout: 60000 }).should(path => {
        expect(path).to.eq("/upload-progress");
      });

      // Success (60s timeout)
      cy.location("pathname", { timeout: 60000 }).should(path => {
        expect(path).to.eq("/upload-complete");
      });

      cy.get("#oyster-handle")
        .invoke("text")
        .then(handle => {
          expect(handle).to.not.be.empty;

          cy.visit("/download-form");
          cy.get("#download-handle-input").type(handle, { force: true });
          cy.get("#download-btn").click({ force: true });
        });
    });
  });
});
