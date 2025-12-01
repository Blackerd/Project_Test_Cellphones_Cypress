describe('Cellphones E2E Test Suite', () => {

    // --- DỮ LIỆU CHUNG (Tùy chỉnh) ---
    // SỬ DỤNG TÀI KHOẢN ĐÃ CÓ VÀ ĐÃ ĐƯỢC KIỂM TRA HỢP LỆ TRÊN SỐ ĐIỆN THOẠI VÀ MẬT KHẨU
    const USER = '0396193735'; 
    const PASS = '123456789@Qd';
    const NEW_NAME = 'Nguyễn Tester Mới'; 
    // ------------------------------------

    // =======================================================
    // 1. CHỨC NĂNG: AUTHENTICATION TESTS (Đăng nhập)
    // =======================================================
    describe('Authentication Tests', () => {
        
        // TC-01: Đăng nhập thành công với thông tin hợp lệ (Giữ nguyên code của bạn)
        it('CP-LOGIN-01: Successful login with valid credentials', () => {
            cy.log('🔐 TC-01: Đăng nhập thành công');
            cy.visit('https://smember.com.vn/login');
            cy.viewport(1280, 720);
            cy.wait(5000);

            // Nhập thông tin đăng nhập
            cy.get('body').then(($body) => {
                if ($body.find('input[data-slot="input"]').length > 0) {
                    cy.get('input[data-slot="input"]').then(($inputs) => {
                        cy.wrap($inputs[0]).clear().type(USER, { force: true, delay: 100 });
                        cy.wrap($inputs[1]).clear().type(PASS, { force: true, delay: 100 });
                    });
                } else {
                    cy.get('input[type="tel"], input[type="text"]').first().clear().type(USER, { force: true, delay: 100 });
                    cy.get('input[type="password"]').clear().type(PASS, { force: true, delay: 100 });
                }
            });
            
            // Submit form đăng nhập
            cy.get('body').then(($body) => {
                if ($body.find('button[type="submit"]').length > 0) {
                    cy.get('button[type="submit"]').click({ force: true });
                } else {
                    cy.contains('button', 'Đăng nhập').first().click({ force: true });
                }
            });
            
            cy.wait(10000);

            // Verify đăng nhập thành công
            cy.get('body').should(($body) => {
                const bodyText = $body.text();
                expect(bodyText).to.match(/Tài khoản|Xin chào|Bạn đang ở kênh thành viên|Đăng nhập thành công/i);
            });
            cy.log('✅ TC-01 PASS: Đăng nhập thành công');
        });
        
        // ... (Bạn có thể giữ lại hoặc comment TC-02: Failed login with wrong password) ...

    });

    // --- HÀM HỖ TRỢ: Login và Chuyển Domain (Sử dụng lại logic từ TC-NAV-01) ---
    const loginAndNavigateToCellphones = () => {
        cy.visit('https://smember.com.vn/login');
        cy.viewport(1280, 720);
        cy.wait(5000);

        // Đăng nhập
        cy.get('input[type="tel"], input[type="text"]').first().clear().type(USER, { force: true, delay: 100 });
        cy.get('input[type="password"]').clear().type(PASS, { force: true, delay: 100 });
        cy.contains('button', 'Đăng nhập').first().click({ force: true });
        
        cy.wait(10000); // Chờ chuyển trang Smember

        // Chuyển sang Cellphones
        cy.get('a[href="https://cellphones.com.vn"]').first().click({ force: true });
        
        // Cypress cần cy.origin() để xử lý chuyển domain
        cy.origin('https://cellphones.com.vn', () => {
            cy.viewport(1280, 720);
            cy.wait(5000);
            cy.url().should('include', 'cellphones.com.vn');
        });
        cy.log('Đã đăng nhập và chuyển domain thành công.');
    };
    
    // =======================================================
    // 2. CHỨC NĂNG: HOMEPAGE & PROMOTION TESTS (Trang chủ & Khuyến mãi)
    // =======================================================
    describe('Homepage & Promotion Tests', () => {
        
        // Chạy trước mỗi test trong khối này
        beforeEach(() => {
            cy.visit('https://cellphones.com.vn/');
            cy.viewport(1280, 720);
            cy.wait(3000);
        });

        it('TC_HP_01: Verify successful homepage loading and display.', () => {
            cy.log('🏠 TC_HP_01: Kiểm tra trang chủ tải thành công.');
            
            cy.url().should('eq', 'https://cellphones.com.vn/');
            cy.get('header').should('be.visible'); 
            cy.get('footer').should('be.visible');
            
            // Xác minh có ít nhất 1 banner chính hiển thị
            cy.get('.main-slider .swiper-slide').should('have.length.at.least', 1);
            cy.log('✅ TC_HP_01 PASS: Trang chủ tải thành công.');
        });
        
        it('TC_HP_02: Check Main Banner functionality and redirection.', () => {
            cy.log('📢 TC_HP_02: Kiểm tra liên kết Banner.');
            
            // Tìm và click vào banner đầu tiên
            // Dùng selector linh hoạt cho banner và link
            cy.get('.main-slider a').first().then(($link) => {
                const href = $link.attr('href');
                cy.wrap($link).click({ force: true });
                
                // Xác minh chuyển hướng
                cy.url().should('not.include', 'cellphones.com.vn/$');
                cy.url().should('include', href.split('.vn/')[1].split('.html')[0]);
            });

            cy.log('✅ TC_HP_02 PASS: Chuyển hướng banner thành công.');
        });
    });

    // =======================================================
    // 3. CHỨC NĂNG: PROFILE MANAGEMENT TESTS (Quản lý Tài khoản)
    // =======================================================
    // NOTE: Các test này YÊU CẦU loginAndNavigateToCellphones() thành công trước.
    describe('Profile Management Tests', () => {
        
        // Điều kiện tiên quyết: Đăng nhập và chuyển sang Cellphones trước khi mỗi test chạy
        beforeEach(() => {
            loginAndNavigateToCellphones();
        });

        it('TC_PM_02: Update Display Name (Họ và Tên) successfully.', () => {
            cy.log('👤 TC_PM_02: Cập nhật Tên hiển thị.');
            
            // 1. Điều hướng đến trang Thông tin cá nhân
            // Cần tìm selector chính xác để vào trang profile trên Cellphones
            cy.get('.user-info-area a[href*="customer/account/"]').click({ force: true }); // Selector ví dụ
            cy.contains('Thông tin tài khoản').click({ force: true }); // Selector ví dụ
            
            // 2. Nhập tên mới
            // Thay selector '#input-name' bằng selector của trường Họ và Tên
            cy.get('#input-name').clear().type(NEW_NAME); 
            
            // 3. Lưu thay đổi
            cy.contains('button', 'Lưu thay đổi').click({ force: true }); 

            // 4. Xác minh
            cy.get('.message-success').should('contain', 'Cập nhật thành công'); // Selector thông báo
            cy.get('#input-name').should('have.value', NEW_NAME);
            
            cy.log('✅ TC_PM_02 PASS: Cập nhật tên thành công.');
        });

        it('TC_PM_03: Add a new Shipping Address successfully.', () => {
            cy.log('📍 TC_PM_03: Thêm địa chỉ giao hàng mới.');
            
            // 1. Điều hướng đến trang Sổ Địa Chỉ
            cy.get('.user-info-area a[href*="customer/address/"]').click({ force: true }); // Selector ví dụ
            cy.contains('Quản lý địa chỉ').click({ force: true }); // Selector ví dụ
            
            // 2. Click Thêm địa chỉ mới
            cy.contains('button', 'Thêm địa chỉ mới').click({ force: true }); 
            
            // 3. Nhập dữ liệu mới (Cần tìm selector chi tiết cho form địa chỉ)
            const randomPhone = '09' + Math.floor(Math.random() * 90000000 + 10000000);
            
            cy.get('#ten_nguoi_nhan').type('Người Nhận Test');
            cy.get('#sdt_nguoi_nhan').type(randomPhone);
            cy.get('#tinh_thanh').select('Hồ Chí Minh'); // Ví dụ: Chọn tỉnh/thành
            cy.get('#quan_huyen').select('Quận 1');     // Ví dụ: Chọn quận
            cy.get('#dia_chi_chi_tiet').type('Tầng 1, 123 Đường Test'); 

            // 4. Lưu
            cy.contains('button', 'Lưu địa chỉ').click({ force: true });

            // 5. Xác minh
            cy.get('.message-success').should('contain', 'Thêm địa chỉ thành công');
            // Xác minh địa chỉ mới xuất hiện trong danh sách
            cy.get('.address-list').should('contain', 'Người Nhận Test'); 

            cy.log('✅ TC_PM_03 PASS: Thêm địa chỉ mới thành công.');
        });
    });
    
    // ... (Các describe khác như Filtering & Sorting Tests)
});