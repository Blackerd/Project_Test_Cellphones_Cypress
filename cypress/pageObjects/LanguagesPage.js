class LanguagesPage {

    // --- Navigation ---
    getAdminMenu() {
        return cy.get('.oxd-main-menu-item').contains('Admin');
    }
    getQualificationsSubMenu() {
        return cy.get('.oxd-topbar-body-nav-tab-item').contains('Qualifications ');
    }
    getLanguagesLink() {
        return cy.get('.oxd-topbar-body-nav-tab-link').contains('Languages');
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

    // --- Form Input ---
    getNameInput() {
        return cy.get('.oxd-input-field-bottom-space').find('input.oxd-input').eq(1);
    }

    // --- Table Record ---
    getRecordRow(name) {
        return cy.xpath(`//div[text()='${name}']/ancestor::div[@role="row"]`);
    }

    // --- Navigation ---
    navigateToLanguages() {
        this.getAdminMenu().click();
        this.getQualificationsSubMenu().click();
        this.getLanguagesLink().click();
        cy.url().should('include', 'qualifications/languages');
        cy.contains('.oxd-text--h6', 'Languages').should('be.visible');
    }
}

export default LanguagesPage;
