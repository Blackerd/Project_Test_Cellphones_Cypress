describe('CellphoneS Comprehensive E2E Test Suite: Login, Homepage, and Account Update', () => {

    // Khai báo hằng số cho toàn bộ test suite
    const LOGIN_URL = 'https://smember.com.vn/login';
    const CELLPHONES_ORIGIN = 'https://cellphones.com.vn';
    const SMEMBER_ORIGIN = 'https://smember.com.vn';
    const TEST_NEW_NAME = 'Duong Gia Dung Auto Test'; 
    const TEST_GENDER = 'Nam'; // Giới tính để chọn

    // --- SETUP: Đảm bảo đăng nhập 1 lần và ở trang chủ CELLPHONES.COM.VN ---
    before(() => {
        cy.log('🔐 Setup: Thực hiện ĐĂNG NHẬP 1 LẦN cho toàn bộ test suite.');
        cy.visit(LOGIN_URL);
        cy.viewport(1280, 720);
        
        // Đăng nhập
        cy.get('input[data-slot="input"]', { timeout: 10000 }).should('be.visible');
        cy.get('input[data-slot="input"]').then(($inputs) => {
            cy.wrap($inputs[0]).clear().type('0385276851', { force: true, delay: 100 });
            cy.wrap($inputs[1]).clear().type('24102003Bi', { force: true, delay: 100 });
        });
        cy.get('button[type="submit"], button').contains('Đăng nhập').click({ force: true });
        cy.wait(8000); 
        
        // Chuyển về trang chủ Cellphones
        cy.log('➡️ Setup: Chuyển hướng đến Trang chủ Cellphones (Top Origin)');
        cy.contains('a', 'cellphones.com.vn').first().then(($link) => {
            if ($link.attr('target') === '_blank') {
                cy.wrap($link).invoke('removeAttr', 'target');
            }
        }).click({ force: true });
        cy.wait(5000); 
        
        cy.url().should('include', CELLPHONES_ORIGIN);
        cy.log('✅ Setup: Đã ở Trang chủ Cellphones.');
    });
    
    // --- TEST CASE CHÍNH: KẾT HỢP TẤT CẢ CÁC BƯỚC ---
    it('CP-E2E-01: Login -> Homepage Scroll -> Navigate to S-Member -> Account Update (with Gender)', () => {
        cy.log('📝 Test Case: Kiểm tra chuỗi hành động người dùng hoàn chỉnh');
        
        // --- 1. PHẦN 1: Tương tác trên Trang chủ (cellphones.com.vn) ---
        cy.origin(CELLPHONES_ORIGIN, { args: { CELLPHONES_ORIGIN } }, ({ CELLPHONES_ORIGIN }) => {
            
            // a. Cuộn trang và cuộn lên
            cy.log('➡️ Hành động 1: Cuộn trang chủ');
            cy.scrollTo('bottom', { duration: 1500 }); 
            cy.scrollTo('top', { duration: 500 }); 
            cy.wait(1000); 
            
            // b. Click Avatar và Click "Truy cập S-Member"
            cy.log('➡️ Hành động 2: Nhấn vào Avatar/Tên người dùng (Dương)');
            cy.contains('button', 'Dũng', { timeout: 10000 }).click({ force: true }); 
            cy.wait(1000); 

            cy.log('➡️ Action: Nhấn "Truy cập Smember" trong menu');
            cy.contains('a', 'Truy cập Smember').click({ force: true });
            
            cy.wait(7000); // Chờ chuyển hướng hoàn tất
        });
        
        // --- 2. PHẦN 2: Cập nhật Thông tin Tài khoản (smember.com.vn) ---
        
        cy.log('➡️ Hành động 3: Thao tác cập nhật Thông tin tài khoản');
        
        cy.wait(3000); // Đợi trang S-Member tải hoàn tất

        // Xác minh đã chuyển đến trang Tổng quan
        cy.url({ timeout: 10000 }).should('include', SMEMBER_ORIGIN); 
        
        // a. Nhấn vào "Thông tin tài khoản"
        cy.log('➡️ Action: Nhấn vào menu "Thông tin tài khoản"');
        cy.contains('a', 'Thông tin tài khoản', { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });
          
        cy.wait(2000);
        
        // b. Nhấn nút "Cập nhật"
        cy.log('➡️ Action: Nhấn nút "Cập nhật"');
        cy.contains('button', 'Cập nhật').click();
        cy.wait(2000);

        // c. Cập nhật Tên hiển thị VÀ GIỚI TÍNH
        cy.log('➡️ Action: Cập nhật Tên hiển thị và Giới tính');
        const nameInputSelector = 'input[placeholder="Tên"], input[name="name"], form input[type="text"]';
        
        // Nhập Tên
        cy.get(nameInputSelector).first().clear().type(TEST_NEW_NAME, { force: true });
        
        // ⭐⭐ THAO TÁC MỚI: CHỌN GIỚI TÍNH ⭐⭐
        // GIẢ ĐỊNH: Trường Giới tính là một Dropdown (thẻ <select>) hoặc một nhóm Radio Button
        
        // Phương án 1: Dùng cho Dropdown (nếu trường Giới tính là thẻ <select>)
        // cy.get('select[name="gender"], select[data-testid="gender"]').select(TEST_GENDER, { force: true });
        
        // Phương án 2: Dùng cho Radio Button (nếu trường Giới tính là nhóm radio button)
        cy.get('input[placeholder="Chọn giới tính"], .dropdown-trigger, .gender-select')
            .first()
            .click({ force: true, timeout: 10000 }); 

        cy.wait(1000);
        
        // Sau khi click mở dropdown, tìm và click vào tùy chọn "Nữ"
        // Thường các tùy chọn dropdown sẽ là thẻ <div> hoặc <li>
        cy.log(`⭐ Action: Selecting Gender: ${TEST_GENDER}`);
        cy.contains(TEST_GENDER, { timeout: 5000 }) 
            .should('be.visible')
            .click({ force: true });
        
        // Nhấn nút "Lưu"
        cy.contains('button', 'Cập nhật thông tin').click();
        cy.wait(5000);

        // d. Xác minh cập nhật thành công
        cy.log('✅ Verification: Kiểm tra thông tin đã được cập nhật');
        cy.contains(/Cập nhật thành công|Đã lưu/i, { timeout: 10000 }).should('be.visible');
        cy.contains(TEST_NEW_NAME).should('be.visible');
        
        cy.log('🏆 CP-E2E-01 PASS: Chuỗi hành động đã được kiểm tra thành công.');
    });
});