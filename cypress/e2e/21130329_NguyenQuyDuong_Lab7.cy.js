describe('Cellphones E2E Test Suite', () => {  
    // =======================================================
    // 1. CHỨC NĂNG: FILTERING & SORTING TESTS (Lọc & Sắp xếp)
    // =======================================================
    describe('Filtering & Sorting Tests', () => {
        
        // --- TC_FILTER_01: Lọc thành công bằng cách click vào danh mục Laptop ---
        it('CP-FILTER-01: Successful product filtering by category (Laptop).', () => {
            cy.log('🔍 TC-06: Lọc sản phẩm theo danh mục "Laptop"');
            
            // 1. Điều hướng đến trang chủ Cellphones (Nơi có danh mục)
            cy.visit('https://cellphones.com.vn');
            cy.viewport(1280, 720);
            cy.wait(5000);

            // 2. Click vào danh mục Laptop
            // Sử dụng selector dựa trên thuộc tính 'href' và văn bản 'Laptop' để đảm bảo độ chính xác
            const laptopSelector = 'a[href="/laptop.html"]';

            cy.get('body').then(($body) => {
                if ($body.find(laptopSelector).length > 0) {
                    cy.get(laptopSelector).first().click({ force: true });
                } else {
                    // Nếu không tìm thấy link trực tiếp, thử tìm theo text
                    cy.contains('p', 'Laptop')
                      .closest('a') // Tìm thẻ <a> gần nhất
                      .click({ force: true });
                }
            });
            
            // 3. Chờ trang tải và xác minh URL/Nội dung
            cy.wait(7000);
            
            // Verify 1: URL đã chuyển đến trang laptop
            cy.url().should('include', '/laptop.html');
            
            // Verify 2: Nội dung trang chứa các sản phẩm laptop và tiêu đề
            cy.get('body').should(($body) => {
                const bodyText = $body.text();
                // Xác minh có các từ khóa liên quan đến Laptop và thương hiệu
                expect(bodyText).to.match(/Laptop|MacBook|Dell|HP|Asus|Lenovo/i); 
            });
            
            // Verify 3: Sản phẩm đã được hiển thị
            cy.get('.product-item, [class*="product"], .item-product').should('have.length.at.least', 1);
            
            cy.log('✅ TC-06 PASS: Lọc theo danh mục Laptop thành công');
        });
        
    });

    
// =======================================================
// 2. CHỨC NĂNG: ORDER MANAGEMENT TESTS (Quản lý Đơn hàng)
// =======================================================
describe('Order Management Tests', () => {
    
    // --- TC_ORDER-01: Negative Path - Truy cập Lịch sử Đơn hàng  ---
    it('CP-ORDER-01: Failed access to Order History .', () => {
        cy.log('🚫 TC-04: Truy cập đơn hàng ');

        // 1. Cố gắng truy cập trực tiếp URL Đơn hàng
        cy.visit('https://smember.com.vn/order?company_id=cellphones', { failOnStatusCode: false });
        cy.viewport(1280, 720);
        cy.wait(5000);
        
        // 2. Verify: Hệ thống phải chuyển hướng (redirect) về trang đăng nhập
        cy.url().should('include', '/login');
        cy.get('body').should('contain.text', 'Đăng nhập');

        cy.log('✅ CP-ORDER-01 PASS: Hệ thống đã chặn truy cập và chuyển về trang đăng nhập');
    });
});
});
    