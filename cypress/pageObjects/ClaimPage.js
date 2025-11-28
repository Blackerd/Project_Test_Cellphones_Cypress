// File: cypress/pageObjects/ClaimPage.js - CODE ĐÃ FIX LỖI VÀ TỐI ƯU

class ClaimPage {
    // Menu
    getClaimMenu() {
        // Selector ổn định cho menu Claim trên thanh sidebar trái
        return cy.get('.oxd-main-menu-item').contains('Claim'); 
    }
    
    // **PHƯƠNG THỨC MỚI ĐÃ THÊM ĐỂ KHẮC PHỤC LỖI:**
    getAssignClaimSubMenu() {
        // Selector cho nút "Assign Claim" trên menu phụ (Top Bar)
        return cy.get('.oxd-topbar-body-nav-tab-item').contains('Assign Claim');
    }

    // Assign Button (Không còn cần thiết vì chúng ta dùng getAssignClaimSubMenu)
    // getAssignButtonOnList() {}
    
    // Form Assign Claim
    // Đã sửa chỉ mục (index) thành eq(0) vì Employee Name là trường Autocomplete đầu tiên trong form Assign Claim.
    getEmployeeNameInput() {
        // Trường nhập tên nhân viên (Autocomplete input đầu tiên)
        return cy.get('.oxd-autocomplete-text-input input').eq(0); 
    }

    getSaveButton() {
        // Nút Save trong form
        return cy.get('button[type="submit"]');
    }
    
    // Các selector báo lỗi
    getRequiredError() {
        return cy.contains('.oxd-input-field-error-message', 'Required');
    }
    
    getSuccessToast() {
        return cy.get('.oxd-toast-content--success');
    }
    
    getInvalidDataError() {
        // Tìm thông báo lỗi gần trường input bị lỗi (dùng selector tương đối)
        return cy.get('.oxd-autocomplete-text-input').parent().parent().find('.oxd-input-field-error-message');
    }
}

export default ClaimPage;