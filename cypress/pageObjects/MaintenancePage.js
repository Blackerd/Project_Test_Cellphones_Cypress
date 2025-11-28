class MaintenancePage {
    // --- 1. Menu Sidebar ---
    getMaintenanceMenu() {
        // Selector ổn định cho menu Maintenance trên thanh sidebar trái
        return cy.get('.oxd-main-menu-item').contains('Maintenance'); 
    }

    // --- 2. Màn hình Xác nhận Mật khẩu (Security Confirmation) ---
    getPasswordInputOnConfirmation() {
        // Trường nhập mật khẩu trên màn hình xác nhận bảo mật
        return cy.get('input[name="password"]'); 
    }

    getConfirmSubmitButton() {
        // Nút Submit (Xác nhận) trên màn hình xác nhận mật khẩu
        return cy.get('button[type="submit"]'); 
    }
    
    // --- 3. Màn hình Purge Records ---
    getPurgeRecordsSubMenu() {
        // Nút Purge Records trên menu phụ (Top Bar), dùng để chuyển tab
        return cy.get('.oxd-topbar-body-nav-tab-item').contains('Purge Records');
    }

    getRecordTypeDropdown() {
        // Dropdown chọn loại bản ghi (Employee Records / Candidate Records)
        return cy.get('.oxd-select-text-input').first();
    }
    
    getEmployeeNameInput() {
        // Trường nhập tên nhân viên (Autocomplete input) trong form Purge
        // Thường là input thứ 2 trên trang sau loại bản ghi
        return cy.get('.oxd-autocomplete-text-input input').eq(0); 
    }
    
    getSearchButton() {
        // Nút Search (hoặc Purge) trong form Purge
        return cy.get('button[type="submit"]').contains('Search'); 
    }
    
    getPurgeButton() {
        // Nút Purge chính (màu đỏ)
        return cy.get('button').contains('Purge'); 
    }
}

export default MaintenancePage;