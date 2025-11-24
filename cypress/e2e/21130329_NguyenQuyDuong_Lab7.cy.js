import ClaimPage from '../pageObjects/ClaimPage';

describe('Lab 7 - Chức năng Assign Claim - MSSV: 21130329', () => {
    const claimPage = new ClaimPage();
    const VALID_EMPLOYEE_NAME = 'Fiona White'; // Tên nhân viên cần phải tồn tại
    const INVALID_EMPLOYEE_NAME = 'Non Existent User ZZZ'; // Tên nhân viên không tồn tại

    // Bước Precondition: Đăng nhập và điều hướng đến màn hình Assign Claim
    beforeEach(() => {
        // 1. Admin is logged in.
        cy.loginAdmin('Admin', 'admin123'); 
        
        // 2. Navigate to View Claims
        claimPage.getClaimMenu().click();
        claimPage.getViewClaimsSubMenu().click();
        
        // BƯỚC ĐIỀU HƯỚNG: Click nút Assign đầu tiên trong danh sách để mở form.
        cy.wait(1500); // Đợi dữ liệu bảng tải xong
        // Kiểm tra xem có claim nào không và click nút Assign đầu tiên
        claimPage.getAssignButtonOnList().click(); 
        
        // Xác minh đã vào form Assign Claim
        cy.contains('.oxd-text--h6', 'Assign Claim').should('be.visible');
    });
    
    //---------------------------------------------------------
    // TC_CLAIM_ASIGN_001: Happy Path - Gán thành công
    //---------------------------------------------------------
    it('TC_CLAIM_ASIGN_001: Check successful assignment to a valid employee.', () => {
        // 4. Enter a Valid Employee Name
        claimPage.getEmployeeNameInput().type(VALID_EMPLOYEE_NAME);
        // Chờ autocomplete hiện ra và nhấn Enter để chọn chính xác
        cy.wait(500); 
        claimPage.getEmployeeNameInput().type('{downArrow}{enter}'); 

        // 5. Click the Save button.
        claimPage.getSaveButton().click();

        // Expected Output: System displays a success message.
        claimPage.getSuccessToast().should('be.visible').and('contain', 'Successfully Assigned');
        
        // Sau khi gán thành công, trang sẽ tự động điều hướng về View Claims
        cy.url().should('include', '/viewClaims');
    });

    //---------------------------------------------------------
    // TC_CLAIM_ASIGN_002: Invalid Data - Tên nhân viên không tồn tại
    //---------------------------------------------------------
    it('TC_CLAIM_ASIGN_002: Check error message when assigning to a non-existent employee.', () => {
        // 4. Enter an Invalid Employee Name.
        claimPage.getEmployeeNameInput().type(INVALID_EMPLOYEE_NAME);
        
        // 5. Click the Save button.
        claimPage.getSaveButton().click();

        // Expected Output 1: System displays an error message (Invalid Employee Name).
        claimPage.getInvalidDataError().should('be.visible').and('contain', 'Invalid');
        
        // Expected Output 2: Assignment is NOT completed (vẫn ở màn hình Assign Claim).
        cy.contains('Assign Claim').should('be.visible'); 
    });
    
    //---------------------------------------------------------
    // TC_CLAIM_ASIGN_003: Mandatory Field Check - Để trống tên nhân viên
    //---------------------------------------------------------
    it('TC_CLAIM_ASIGN_003: Check required field validation for the Employee Name field.', () => {
        // 4. Leave the Employee Name field blank. (Mặc định field trống)
        
        // 5. Click the Save button.
        claimPage.getSaveButton().click();

        // Expected Output: System displays a required field error message.
        // Dùng selector getRequiredError() đã tạo trong POM
        claimPage.getRequiredError().should('be.visible').and('contain', 'Required');
        
        // Expected Output 2: Assignment is NOT completed.
        cy.contains('Assign Claim').should('be.visible');
    });
});