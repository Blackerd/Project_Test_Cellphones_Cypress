class EducationPage {

    // --- Navigation ---
    getAdminMenu() {
        return cy.get('.oxd-main-menu-item').contains('Admin');
    }
    getQualificationsSubMenu() {
        return cy.get('.oxd-topbar-body-nav-tab-item').contains('Qualifications ');
    }
    getEducationLink() {
        return cy.get('.oxd-topbar-body-nav-tab-link').contains('Education');
    }

    // --- CRUD Buttons ---
    getAddButton() {
        return cy.get('button').contains(' Add ');
    }
    getSaveButton() {
        return cy.get('button[type="submit"]').contains(' Save ');
    }
    getDeleteSelectedButton() {
        return cy.get('button').contains(' Delete Selected ');
    }
    getYesDeleteButton() {
        return cy.get('.orangehrm-modal-footer button').contains(' Yes, Delete');
    }
    getSuccessToast() {
        return cy.get('.oxd-toast--success');
    }

    // --- Input ---
    getLevelInput() {
        return cy.get('.oxd-input-field-bottom-space').find('input.oxd-input').eq(1);
    }

    // --- Table Record ---
    getRecordRow(levelName) {
        return cy.xpath(`//div[text()='${levelName}']/ancestor::div[@role="row"]`);
    }

    // --- Navigation Method ---
    navigateToEducation() {
        this.getAdminMenu().click();
        this.getQualificationsSubMenu().click();
        this.getEducationLink().click();
        cy.url().should('include', 'qualifications/education');
        cy.contains('.oxd-text--h6', 'Education').should('be.visible');
    }
}

export default EducationPage;
