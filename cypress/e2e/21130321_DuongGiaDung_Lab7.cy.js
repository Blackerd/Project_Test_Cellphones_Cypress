describe('CellphoneS Comprehensive E2E Test Suite: Login, Homepage, and Account Update', () => {

    const LOGIN_URL = 'https://smember.com.vn/login';
    const CELLPHONES_ORIGIN = 'https://cellphones.com.vn';
    const SMEMBER_ORIGIN = 'https://smember.com.vn';
    const TEST_NEW_NAME = 'Duong Gia Dung Auto Test';
    const TEST_GENDER = 'Nam'; 

    // -----------------------------------------
    // SETUP – LOGIN 1 LẦN
    // -----------------------------------------
    before(() => {
        cy.log('🔐 Setup: Login 1 lần');
        cy.visit(LOGIN_URL);
        cy.viewport(1280, 720);

        // Nhập user + password
        cy.get('input[data-slot="input"]', { timeout: 10000 }).should('be.visible');
        cy.get('input[data-slot="input"]').then(($inputs) => {
            cy.wrap($inputs[0]).clear().type('0385276851', { force: true, delay: 100 });
            cy.wrap($inputs[1]).clear().type('24102003Bi', { force: true, delay: 100 });
        });

        // Submit login
        cy.contains('button', 'Đăng nhập').click({ force: true });
        cy.wait(8000);

        // Chuyển sang Cellphones.com.vn
        cy.log('➡️ Redirect về Cellphones');
        cy.contains('a', 'cellphones.com.vn').first().then(($link) => {
            if ($link.attr('target') === '_blank') {
                cy.wrap($link).invoke('removeAttr', 'target');
            }
        }).click({ force: true });

        cy.wait(5000);
        cy.url().should('include', CELLPHONES_ORIGIN);
        cy.log('✅ Setup DONE');
    });

    // ============================================================
    // MAIN TEST – HOME → SMEMBER → UPDATE ACCOUNT
    // ============================================================
    it('CP-E2E-01: Login → Homepage → SMember → Update Account', () => {
        cy.log('📝 BẮT ĐẦU E2E TEST');

        // -----------------------------------------
        // PART 1 – HOME PAGE (Cellphones.com.vn)
        // -----------------------------------------
        cy.origin(CELLPHONES_ORIGIN, () => {

            cy.log('➡️ Scroll homepage');
            cy.scrollTo('bottom', { duration: 1200 });
            cy.scrollTo('top', { duration: 800 });
            cy.wait(800);

            // Click avatar (selector ổn định nhất)
            cy.log('➡️ Click Avatar');
            cy.get('.styles__AccountElement-sc-1fs0hi0-3', { timeout: 10000 })
                .should('be.visible')
                .click({ force: true });

            // Đợi dropdown mở
            cy.get('.ant-dropdown-menu', { timeout: 10000 }).should('be.visible');

            // Click "Truy cập Smember"
            cy.log('➡️ Click "Truy cập Smember"');
            cy.contains('a', 'Truy cập Smember', { timeout: 10000 })
                .should('be.visible')
                .click({ force: true });

            cy.wait(6000);
        });

        // -----------------------------------------
        // PART 2 – SMEMBER ACCOUNT UPDATE
        // -----------------------------------------
        cy.log('➡️ Đã vào trang SMEMBER - bắt đầu update thông tin');

        cy.wait(4000);
        cy.url().should('include', SMEMBER_ORIGIN);

        // → Click “Thông tin tài khoản”
        cy.contains('a', 'Thông tin tài khoản', { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
        cy.wait(2000);

        // → Click "Cập nhật"
        cy.contains('button', 'Cập nhật', { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
        cy.wait(2000);

        // → Nhập Tên mới
        const nameInputSelector = 'input[placeholder="Tên"], input[name="name"], form input[type="text"]';
        cy.get(nameInputSelector).first()
            .clear()
            .type(TEST_NEW_NAME, { force: true });

        // → Chọn GIỚI TÍNH
        cy.log(`➡️ Chọn giới tính: ${TEST_GENDER}`);

        // Click mở dropdown
        cy.get('input[placeholder="Chọn giới tính"], .gender-select, .dropdown-trigger', { timeout: 10000 })
            .first()
            .click({ force: true });

        cy.wait(500);

        // Chọn giá trị giới tính
        cy.contains(TEST_GENDER, { timeout: 5000 })
            .should('be.visible')
            .click({ force: true });

        // → Lưu thông tin
        cy.contains('button', 'Cập nhật thông tin').click({ force: true });
        cy.wait(5000);

        // -----------------------------------------
        // VERIFY
        // -----------------------------------------
        cy.contains(/Cập nhật thành công|Đã lưu/i, { timeout: 10000 })
            .should('be.visible');

        cy.contains(TEST_NEW_NAME).should('be.visible');

        cy.log('🏆 TEST PASS – Account Updated OK!');
    });
});
