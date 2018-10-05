const UPLOAD_PROGRESS_URL =
  "http://localhost:3001/upload-progress#handle=dittopng5887437a608a2a76914c78f2aed74814f6c6eace1fe9bac6fea1f541679fedbbHvgySpao";

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

      checkUploadComplete();
    });
  });

  it("should continue upload progress", () => {
    cy.visit(UPLOAD_PROGRESS_URL);

    checkUploadComplete();
  });
});

const checkUploadComplete = handle => {
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
};
