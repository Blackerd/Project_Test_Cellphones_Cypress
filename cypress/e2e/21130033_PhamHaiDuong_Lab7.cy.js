// Import Page Objects
import SkillsPage from '../pageObjects/SkillsPage';
import EducationPage from '../pageObjects/EducationPage';
import LicensesPage from '../pageObjects/LicensesPage';
import LanguagesPage from '../pageObjects/LanguagesPage';

// Login constants
const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "admin123";

// Skills
const SKILL_NAME = "Automation Testing";
const SKILL_EDITED = "Manual Testing";

// Education
const EDU_NAME = "Bachelor of IT";
const EDU_EDITED = "Master of Business";

// Licenses
const LICENSE_NAME = "Driving License A1";
const LICENSE_EDITED = "Driving License B2";

// Languages
const LANGUAGE_NAME = "Spanish";
const LANGUAGE_EDITED = "Japanese";

describe("TC_Admin: Quản lý Qualifications (Skills – Education – Licenses – Languages)", () => {

    const skillsPage = new SkillsPage();
    const educationPage = new EducationPage();
    const licensesPage = new LicensesPage();
    const languagesPage = new LanguagesPage();

    beforeEach(() => {
        cy.loginAdmin(ADMIN_USERNAME, ADMIN_PASSWORD);
    });

    // =================================================================
    // 1️⃣ SKILLS MODULE TESTS
    // =================================================================
    describe("SUB_SUITE: Quản lý Skills", () => {

        it("TC_Skills_01: View Skills List", () => {
            skillsPage.navigateToSkills();
            cy.contains('.oxd-table-header-cell', 'Name').should('be.visible');
        });

        it("TC_Skills_02: Add New Skill", () => {
            skillsPage.navigateToSkills();
            skillsPage.getAddButton().click();
            skillsPage.getNameInput().type(SKILL_NAME);
            skillsPage.getSaveButton().click();
            skillsPage.getSuccessToast().should('contain', 'Successfully Saved');
            cy.contains('.oxd-table-cell', SKILL_NAME).should('be.visible');
        });

        it("TC_Skills_03: Edit Skill", () => {
            skillsPage.navigateToSkills();
            skillsPage.getRecordRow(SKILL_NAME).find('.oxd-icon-button--edit').click();
            skillsPage.getNameInput().clear().type(SKILL_EDITED);
            skillsPage.getSaveButton().click();
            skillsPage.getSuccessToast().should('contain', 'Successfully Updated');
            cy.contains('.oxd-table-cell', SKILL_EDITED).should('be.visible');
        });

        it("TC_Skills_04: Delete Skill", () => {
            skillsPage.navigateToSkills();
            cy.contains('.oxd-table-row', SKILL_EDITED).find('.oxd-checkbox-input').click();
            skillsPage.getDeleteSelectedButton().click();
            skillsPage.getYesDeleteButton().click();
            skillsPage.getSuccessToast().should('contain', 'Successfully Deleted');
            cy.contains('.oxd-table-cell', SKILL_EDITED).should('not.exist');
        });

    });

    // =================================================================
    // 2️⃣ EDUCATION MODULE TESTS
    // =================================================================
    describe("SUB_SUITE: Quản lý Education", () => {

        it("TC_Education_01: View Education List", () => {
            educationPage.navigateToEducation();
            cy.contains('.oxd-table-header-cell', 'Level').should('be.visible');
        });

        it("TC_Education_02: Add New Education Level", () => {
            educationPage.navigateToEducation();
            educationPage.getAddButton().click();
            educationPage.getLevelInput().type(EDU_NAME);
            educationPage.getSaveButton().click();
            educationPage.getSuccessToast().should('contain', 'Successfully Saved');
            cy.contains('.oxd-table-cell', EDU_NAME).should('be.visible');
        });

        it("TC_Education_03: Edit Education Level", () => {
            educationPage.navigateToEducation();
            educationPage.getRecordRow(EDU_NAME).find('.oxd-icon-button--edit').click();
            educationPage.getLevelInput().clear().type(EDU_EDITED);
            educationPage.getSaveButton().click();
            educationPage.getSuccessToast().should('contain', 'Successfully Updated');
            cy.contains('.oxd-table-cell', EDU_EDITED).should('be.visible');
        });

        it("TC_Education_04: Delete Education Level", () => {
            educationPage.navigateToEducation();
            cy.contains('.oxd-table-row', EDU_EDITED).find('.oxd-checkbox-input').click();
            educationPage.getDeleteSelectedButton().click();
            educationPage.getYesDeleteButton().click();
            educationPage.getSuccessToast().should('contain', 'Successfully Deleted');
            cy.contains('.oxd-table-cell', EDU_EDITED).should('not.exist');
        });

    });

    // =================================================================
    // 3️⃣ LICENSES MODULE TESTS
    // =================================================================
    describe("SUB_SUITE: Quản lý Licenses", () => {

        it("TC_Licenses_01: View Licenses List", () => {
            licensesPage.navigateToLicenses();
            cy.contains('.oxd-table-header-cell', 'Name').should('be.visible');
        });

        it("TC_Licenses_02: Add New License", () => {
            licensesPage.navigateToLicenses();
            licensesPage.getAddButton().click();
            licensesPage.getNameInput().type(LICENSE_NAME);
            licensesPage.getSaveButton().click();
            licensesPage.getSuccessToast().should('contain', 'Successfully Saved');
            cy.contains('.oxd-table-cell', LICENSE_NAME).should('be.visible');
        });

        it("TC_Licenses_03: Edit License", () => {
            licensesPage.navigateToLicenses();
            licensesPage.getRecordRow(LICENSE_NAME).find('.oxd-icon-button--edit').click();
            licensesPage.getNameInput().clear().type(LICENSE_EDITED);
            licensesPage.getSaveButton().click();
            licensesPage.getSuccessToast().should('contain', 'Successfully Updated');
            cy.contains('.oxd-table-cell', LICENSE_EDITED).should('be.visible');
        });

        it("TC_Licenses_04: Delete License", () => {
            licensesPage.navigateToLicenses();
            cy.contains('.oxd-table-row', LICENSE_EDITED).find('.oxd-checkbox-input').click();
            licensesPage.getDeleteSelectedButton().click();
            licensesPage.getYesDeleteButton().click();
            licensesPage.getSuccessToast().should('contain', 'Successfully Deleted');
            cy.contains('.oxd-table-cell', LICENSE_EDITED).should('not.exist');
        });

    });

    // =================================================================
    // 4️⃣ LANGUAGES MODULE TESTS
    // =================================================================
    describe("SUB_SUITE: Quản lý Languages", () => {

        it("TC_Languages_01: View Languages List", () => {
            languagesPage.navigateToLanguages();
            cy.contains('.oxd-table-header-cell', 'Name').should('be.visible');
        });

        it("TC_Languages_02: Add New Language", () => {
            languagesPage.navigateToLanguages();
            languagesPage.getAddButton().click();
            languagesPage.getNameInput().type(LANGUAGE_NAME);
            languagesPage.getSaveButton().click();
            languagesPage.getSuccessToast().should('contain', 'Successfully Saved');
            cy.contains('.oxd-table-cell', LANGUAGE_NAME).should('be.visible');
        });

        it("TC_Languages_03: Edit Language", () => {
            languagesPage.navigateToLanguages();
            languagesPage.getRecordRow(LANGUAGE_NAME).find('.oxd-icon-button--edit').click();
            languagesPage.getNameInput().clear().type(LANGUAGE_EDITED);
            languagesPage.getSaveButton().click();
            languagesPage.getSuccessToast().should('contain', 'Successfully Updated');
            cy.contains('.oxd-table-cell', LANGUAGE_EDITED).should('be.visible');
        });

        it("TC_Languages_04: Delete Language", () => {
            languagesPage.navigateToLanguages();
            cy.contains('.oxd-table-row', LANGUAGE_EDITED).find('.oxd-checkbox-input').click();
            languagesPage.getDeleteSelectedButton().click();
            languagesPage.getYesDeleteButton().click();
            languagesPage.getSuccessToast().should('contain', 'Successfully Deleted');
            cy.contains('.oxd-table-cell', LANGUAGE_EDITED).should('not.exist');
        });

    });

});
