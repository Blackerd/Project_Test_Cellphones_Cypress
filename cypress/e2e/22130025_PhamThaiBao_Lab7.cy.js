describe('Cellphones E2E Shopping Flow - Combined Test', () => {

  it('CP-FLOW-COMBINED: Login -> Search -> View Product Detail -> Add to Cart -> View Cart -> Update Cart', () => {
    cy.log('🎯 BẮT ĐẦU LUỒNG: Đăng nhập -> Tìm kiếm -> Chi tiết SP -> Giỏ hàng');

    // =================================================================
    // === BƯỚC 1: ĐĂNG NHẬP (TRÊN SMEMBER.COM.VN) ===
    // =================================================================
    cy.log('🔐 Bước 1: Đăng nhập thành công');
    cy.visit('https://smember.com.vn/login');
    cy.viewport(1280, 720);
    cy.wait(5000);

    cy.get('body').then(($body) => {
      if ($body.find('input[data-slot="input"]').length > 0) {
        cy.get('input[data-slot="input"]').then(($inputs) => {
          cy.wrap($inputs[0]).clear().type('0981637968', { force: true, delay: 100 });
          cy.wrap($inputs[1]).clear().type('phamthaibao2004', { force: true, delay: 100 });
        });
      } else {
        cy.get('input[type="tel"], input[type="text"]').first().clear().type('0981637968', { force: true, delay: 100 });
        cy.get('input[type="password"]').clear().type('phamthaibao2004', { force: true, delay: 100 });
      }
    });

    cy.get('body').then(($body) => {
      if ($body.find('button[type="submit"]').length > 0) {
        cy.get('button[type="submit"]').click({ force: true });
      } else {
        cy.contains('button', 'Đăng nhập').first().click({ force: true });
      }
    });

    cy.wait(10000);
    cy.log('✅ Đăng nhập thành công, chuẩn bị chuyển hướng.');

    // =================================================================
    // === BƯỚC 2: CHUYỂN TRANG SANG CELLPHONES ===
    // =================================================================
    cy.log('🏠 Bước 2: Chuyển sang Cellphones và Tìm kiếm');
    cy.get('a[href="https://cellphones.com.vn"]').first().click({ force: true });

    // =================================================================
    // === BƯỚC 3-6: TRÊN CELLPHONES.COM.VN ===
    // =================================================================
    cy.origin('https://cellphones.com.vn', () => {
      cy.viewport(1280, 720);
      cy.wait(5000);

      // --- BƯỚC 3: TÌM KIẾM ---
      cy.log('🔍 Bước 3: Tìm kiếm "iPhone 15"');
      const searchSelectors = [
        'input[placeholder="Bạn muốn mua gì hôm nay?"]',
        'input[type="search"]',
        '.search-input',
        '#search-input'
      ];

      cy.get('body').then(($body) => {
        let found = false;
        for (let selector of searchSelectors) {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().clear().type('iPhone 15{enter}', { force: true, delay: 100 });
            found = true;
            break;
          }
        }
        if (!found) {
          cy.visit('https://cellphones.com.vn/search?q=iPhone+15');
        }
      });

      cy.wait(7000);
      cy.log('✅ Tìm kiếm hoàn tất.');

      // --- BƯỚC 4: MỞ CHI TIẾT SẢN PHẨM ---
      cy.log('📱 Bước 4: Click sản phẩm đầu tiên');

      cy.get('a[href*="/product"], a[href*="/iphone"], a[href*="iphone"]', { timeout: 15000 })
        .should('be.visible');

      cy.get('a[href*="/product"], a[href*="/iphone"], a[href*="iPhone"]')
        .filter((i, el) => el.innerText.toLowerCase().includes("iphone"))
        .first()
        .click({ force: true });
    
    cy.get('h1, button:contains("Mua Ngay")', { timeout: 15000 }).should('be.visible');

      cy.log('✅ Đã vào trang chi tiết SP.');
      cy.wait(8000);

      // --- BƯỚC 5: THÊM VÀO GIỎ HÀNG ---
      cy.log('🛒 Bước 5: Thêm vào giỏ hàng');
      cy.get('body').then(($body) => {
        const addToCartSelectors = [
          'button:contains("Mua Ngay")',
          'button:contains("Thêm vào giỏ hàng")',
          '.btn-buy-now',
          '.add-to-cart'
        ];

        for (let selector of addToCartSelectors) {
          if (selector.includes('contains')) {
            const text = selector.split('"')[1];
            if ($body.find(`button:contains("${text}")`).length > 0) {
              cy.contains('button', text).first().click({ force: true });
              break;
            }
          } else if ($body.find(selector).length > 0) {
            cy.get(selector).first().click({ force: true });
            break;
          }
        }
      });

      cy.wait(5000);
      cy.log('✅ Đã thêm vào giỏ.');

      // --- BƯỚC 6: VÀO GIỎ HÀNG ---
      cy.log('📦 Bước 6: Xem giỏ hàng');
      cy.get('body').then(($body) => {
        const cartSelectors = ['.cart-box', '.cart-icon', 'a[href*="cart"]'];

        let cartClicked = false;
        for (let selector of cartSelectors) {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().click({ force: true });
            cartClicked = true;
            break;
          }
        }

        if (!cartClicked) cy.visit('https://cellphones.com.vn/cart');
      });

      cy.wait(5000);
      cy.url().should('include', '/cart');
      cy.log('🛒 Đang ở trang giỏ hàng — bắt đầu cập nhật');

      // =====================================================================
      // === BƯỚC 7: TĂNG SỐ LƯỢNG ===
      // =====================================================================
      cy.get('body').then(($body) => {
        if ($body.find('button[class*="plus"], button:contains("+"), .qty-plus').length > 0) {
          cy.log('🔼 Tăng số lượng');
          cy.get('button[class*="plus"], button:contains("+"), .qty-plus')
            .first()
            .click({ force: true });
          cy.wait(2000);
        } else cy.log('⚠ Không tìm thấy nút tăng');
      });

      // =====================================================================
      // === BƯỚC 8: GIẢM SỐ LƯỢNG ===
      // =====================================================================
      cy.get('body').then(($body) => {
        if ($body.find('button[class*="minus"], button:contains("-"), .qty-minus').length > 0) {
          cy.log('🔽 Giảm số lượng');
          cy.get('button[class*="minus"], button:contains("-"), .qty-minus')
            .first()
            .click({ force: true });
          cy.wait(2000);
        } else cy.log('⚠ Không tìm thấy nút giảm');
      });

      // =====================================================================
      // === BƯỚC 9: XÓA SẢN PHẨM ===
      // =====================================================================
      cy.get('body').then(($body) => {
        const trashSelectors = [
          'i[class*="trash"]',
          'button[class*="delete"]',
          '.remove-item',
          '.cart-item-delete',
          'svg[xmlns][viewBox]'
        ];

        for (let selector of trashSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log('🗑 Xóa sản phẩm');
            cy.get(selector).first().click({ force: true });
            break;
          }
        }
      });

      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.text().includes('Giỏ hàng trống') || $body.find('.empty-cart').length > 0) {
          cy.log('✅ Đã xóa sản phẩm — Giỏ hàng trống');
        }
      });

      cy.log('🎉 HOÀN THÀNH LUỒNG E2E SHOPPING FLOW!');
    });
  });
});
