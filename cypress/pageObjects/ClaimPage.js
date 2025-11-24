// File: cypress/pageObjects/ClaimPage.js

class ClaimPage {
    // Menu
    getClaimMenu() {
        // Selector cho menu Claim trên thanh sidebar trái
        return cy.get('a[href*="claim"]'); 
    }
    
    // Sub-menu (View Claims)
    getViewClaimsSubMenu() {
        // Selector cho tab View Claims dưới menu Claim
        return cy.get('.oxd-topbar-body-nav-tab-item').contains('View Claims');
    }

    // Assign Button
    getAssignButtonOnList() {
        // Giả định click vào nút Assign đầu tiên trong danh sách (để truy cập form)
        // Cần chỉnh sửa nếu bạn có cách tìm claim cụ thể hơn
        return cy.get('.oxd-table-cell-actions button:contains("Assign")').first(); 
    }
    
    // Form Assign Claim
    getEmployeeNameInput() {
        // Trường nhập tên nhân viên (selector chung cho autocomplete input)
        // Nó thường là input thứ 2 trong form sau trường Type
        return cy.get('.oxd-autocomplete-text-input input').eq(1);
    }

    getSaveButton() {
        // Nút Save trong form
        return cy.get('button[type="submit"]');
    }
    
    getRequiredError() {
        // Thông báo lỗi "Required"
        return cy.contains('.oxd-input-field-error-message', 'Required');
    }
    
    getSuccessToast() {
        // Thông báo thành công chung
        return cy.get('.oxd-toast-content--success');
    }
    
    getInvalidDataError() {
        // Thông báo lỗi dữ liệu không hợp lệ (ví dụ: Invalid Employee Name)
        return cy.get('.oxd-input-field-error-message');
    }
}

export default ClaimPage;