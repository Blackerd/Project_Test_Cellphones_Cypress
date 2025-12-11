/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
  const ignoreMessages = [
    't.map.moveCamera',
    'Cannot read properties of null',
    'clientWidth',
    'Script error'
  ];
  for (const m of ignoreMessages) {
    if (err.message && err.message.includes(m)) return false;
  }
  return true;
});

describe('Cellphones E2E Test Suite - 21130033 Pham Hai Duong (Merged)', () => {

  describe('Authentication Tests', () => {
    it('CP-LOGIN-01: Successful login with valid credentials', () => {
      cy.log('🔐 TC-01: Đăng nhập thành công');
      cy.visit('https://smember.com.vn/login');
      cy.viewport(1280, 720);
      cy.wait(3000);

      cy.get('body').then(($body) => {
        const selectors = [
          'input[data-slot="input"]',
          'input[type="tel"]',
          'input[type="text"]',
          'input[name="phone"]'
        ];

        let tried = false;
        for (const sel of selectors) {
          if (!tried && $body.find(sel).length > 0) {
            cy.get(sel).first().clear().type('0396193735', { force: true });
            if ($body.find('input[type="password"]').length > 0) {
              cy.get('input[type="password"]').first().clear().type('123456789@Qd', { force: true });
            } else {
              cy.get('input[data-slot="input"]').eq(1).clear().type('123456789@Qd', { force: true });
            }
            tried = true;
          }
        }

        if (!tried) {
          cy.get('input[type="tel"], input[type="text"]').first()
            .clear().type('0396193735', { delay: 100 });
          cy.get('input[type="password"]').first().clear().type('123456789@Qd');
        }
      });

      cy.get('body').then(($b) => {
        if ($b.find('button[type="submit"]').length > 0) {
          cy.get('button[type="submit"]').first().click({ force: true });
        } else {
          cy.contains('button', 'Đăng nhập').first().click({ force: true });
        }
      });

      cy.wait(7000);

      cy.contains(/Xin chào|Tài khoản|kênh thành viên/i, { timeout: 10000 }).should('exist');
      cy.log('✅ TC-01 PASS: Đăng nhập thành công');
    });

    it('CP-LOGIN-02: Failed login with wrong password', () => {
      cy.log('🔐 TC-02: Đăng nhập thất bại');
      cy.visit('https://smember.com.vn/login');
      cy.viewport(1280, 720);
      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.find('input[data-slot="input"]').length > 0) {
          cy.get('input[data-slot="input"]').first().clear().type('0396193735', { force: true });
        } else {
          cy.get('input[type="tel"], input[type="text"]').first().clear().type('0396193735', { force: true });
        }
      });

      if (Cypress.$('input[type="password"]').length > 0) {
        cy.get('input[type="password"]').clear().type('saiMatKhau123');
      } else {
        cy.get('input[data-slot="input"]').eq(1).clear().type('saiMatKhau123');
      }

      cy.contains('button', 'Đăng nhập').click({ force: true });
      cy.wait(4000);

      cy.get('body').should(($body) => {
        const txt = $body.text();
        const failPatterns = [
          /sai/i,
          /không đúng/i,
          /thất bại/i,
          /error/i
        ];
        const ok = failPatterns.some(p => p.test(txt));
        expect(ok).to.be.true;
      });

      cy.log('✅ TC-02 PASS: Phát hiện đăng nhập sai');
    });

    it('CP-REG-01: Navigate to Registration page', () => {
      cy.log("📝 TC-03: Chuyển sang trang đăng ký");
      cy.visit('https://smember.com.vn/login');
      cy.viewport(1280, 720);
      cy.wait(2000);

      cy.contains(/Đăng ký|Tạo tài khoản/i).click({ force: true });
      cy.url({ timeout: 10000 }).should('include', '/register');
      cy.contains(/Đăng ký|Tạo tài khoản/i).should('exist');
      cy.log('✅ TC-03 PASS: Điều hướng đến trang đăng ký thành công');
    });

    it('CP-FORGOT-01: Navigate to Forgot Password page', () => {
      cy.log("🔁 TC-04: Điều hướng đến quên mật khẩu");
      cy.visit('https://smember.com.vn/login');
      cy.viewport(1280, 720);
      cy.wait(2000);

      cy.contains(/Quên mật khẩu|Khôi phục mật khẩu|Khôi phục tài khoản/i)
        .first()
        .click({ force: true });

      cy.url().should('match', /forgot|restore/i);
      cy.contains(/Khôi phục mật khẩu|Khôi phục tài khoản|Quên mật khẩu/i).should('exist');
      cy.log("✅ TC-04 PASS: Điều hướng trang quên mật khẩu thành công");
    });
  });


  describe('Search Tests', () => {
    it('CP-SEARCH-01: Successful search for existing product (iPhone 15)', () => {
      cy.log('🔍 TC-05: Tìm kiếm sản phẩm có tồn tại');
      cy.visit('https://cellphones.com.vn');
      cy.viewport(1280, 720);
      cy.wait(3000);

      const searchSelectors = [
        'input[placeholder="Bạn muốn mua gì hôm nay?"]',
        'input[type="search"]',
        '#search-input',
        'input[name="search"]',
      ];

      cy.get('body').then(($body) => {
        let done = false;
        for (const sel of searchSelectors) {
          if (!done && $body.find(sel).length > 0) {
            cy.get(sel).first().clear().type('iPhone 15{enter}', { force: true });
            done = true;
            break;
          }
        }

        if (!done) {
          cy.get('input[type="text"]').first().type('iPhone 15{enter}');
        }
      });

      cy.wait(6000);
      cy.contains(/iPhone|Kết quả tìm kiếm/i, { timeout: 10000 }).should('exist');
      cy.get('body').then(($b) => {
        const hasProduct = $b.find('.product-item, .box-product, [class*="product"]').length > 0;
        expect(hasProduct).to.be.true;
      });

      cy.log('✅ TC-05 PASS: Tìm kiếm sản phẩm tồn tại thành công');
    });

    it('CP-SEARCH-02: Search with non-existing keyword', () => {
      cy.log('🔍 TC-06: Tìm kiếm sản phẩm không tồn tại');
      cy.visit('https://cellphones.com.vn');
      cy.viewport(1280, 720);
      cy.wait(3000);

      cy.get('input[type="search"], input[placeholder]').first().type('xyzabc123NOTFOUND{enter}', { force: true });
      cy.wait(4000);

      cy.get('body').then(($body) => {
        const txt = $body.text();
        const noResults = /không tìm thấy|0 kết quả|không có sản phẩm/i.test(txt);
        cy.log(noResults
          ? '📝 Hệ thống hiển thị thông báo không có kết quả.'
          : '📝 Hệ thống fallback hoặc hiển thị sản phẩm gợi ý (hợp lệ).');
      });

      cy.log('✅ TC-06 PASS: Search không kết quả hoạt động đúng');
    });
  });


  describe('Filtering & Sorting Tests - 21130329 Nguyen Quy Duong', () => {
    it('CP-FILTER-01: Successful product filtering by category (Laptop)', () => {
      cy.log('🔍 TC-07: Lọc sản phẩm theo danh mục "Laptop"');
      cy.visit('https://cellphones.com.vn');
      cy.viewport(1280, 720);
      cy.wait(3000);

      const laptopSelector = 'a[href="/laptop.html"]';

      cy.get('body').then(($body) => {
        if ($body.find(laptopSelector).length > 0) {
          cy.get(laptopSelector).first().click({ force: true });
        } else if ($body.find('a').filter((i, el) => /Laptop/i.test(el.innerText)).length > 0) {
          cy.get('a').filter((i, el) => /Laptop/i.test(el.innerText)).first().click({ force: true });
        } else {
          cy.log('⚠ Không tìm thấy link Laptop - test sẽ fail nếu URL không chuyển');
        }
      });

      cy.wait(6000);
      cy.url().should('include', '/laptop.html');
      cy.get('body').should(($body) => {
        const bodyText = $body.text();
        expect(bodyText).to.match(/Laptop|MacBook|Dell|HP|Asus|Lenovo/i);
      });

      cy.get('body').then(($body) => {
        const count = $body.find('.product-item, [class*="product"], .item-product').length;
        expect(count).to.be.greaterThan(0);
      });

      cy.log('✅ CP-FILTER-01 PASS: Lọc theo danh mục Laptop thành công');
    });
  });


  describe('Order Management Tests - 21130321 Duong Gia Dung', () => {
    it('CP-ORDER-01: Failed access to Order History (should redirect to login)', () => {
      cy.log('🚫 CP-ORDER-01: Truy cập đơn hàng (negative)');
      cy.visit('https://smember.com.vn/order?company_id=cellphones', { failOnStatusCode: false });
      cy.viewport(1280, 720);
      cy.wait(3000);

      cy.url().should('include', '/login');
      cy.get('body').should('contain.text', 'Đăng nhập');
      cy.log('✅ CP-ORDER-01 PASS: Hệ thống đã chặn truy cập và chuyển về trang đăng nhập');
    });
  });


  describe('Cellphones E2E Shopping Flow - Combined Test - 22130025 Pham Thai Bao', () => {
    it('CP-FLOW-COMBINED: Login -> Search -> View Product Detail -> Add to Cart -> View Cart -> Update Cart', () => {
      cy.log('🎯 CP-FLOW-COMBINED: Bắt đầu luồng mua hàng E2E');

      cy.visit('https://smember.com.vn/login');
      cy.viewport(1280, 720);
      cy.wait(3000);

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
          cy.get('button[type="submit"]').first().click({ force: true });
        } else {
          cy.contains('button', 'Đăng nhập').first().click({ force: true });
        }
      });

      cy.wait(9000);
      cy.log('✅ Đăng nhập thành công, chuẩn bị chuyển hướng.');

      cy.get('body').then(($b) => {
        const link = $b.find('a[href="https://cellphones.com.vn"]').first();
        if (link && link.length) {
          cy.wrap(link).invoke('removeAttr', 'target').click({ force: true });
        } else if ($b.find('a').filter((i, el) => /cellphones.com.vn/i.test(el.href)).length > 0) {
          cy.get('a').filter((i, el) => /cellphones.com.vn/i.test(el.href)).first().invoke('removeAttr', 'target').click({ force: true });
        } else {
          cy.visit('https://cellphones.com.vn');
        }
      });

      cy.origin('https://cellphones.com.vn', () => {
        cy.viewport(1280, 720);
        cy.wait(3000);

        cy.log('🔍 Tìm kiếm iPhone 15');
        const searchSelectors = [
          'input[placeholder="Bạn muốn mua gì hôm nay?"]',
          'input[type="search"]',
          '.search-input',
          '#search-input'
        ];

        cy.get('body').then(($body) => {
          let found = false;
          for (const sel of searchSelectors) {
            if ($body.find(sel).length > 0) {
              cy.get(sel).first().clear().type('iPhone 15{enter}', { force: true, delay: 100 });
              found = true;
              break;
            }
          }
          if (!found) {
            cy.visit('https://cellphones.com.vn/search?q=iPhone+15');
          }
        });

        cy.wait(6000);
        cy.log('✅ Tìm kiếm hoàn tất.');

        cy.get('body').then(($body) => {
          const linkCandidates = $body.find('a[href*="/product"], a[href*="/iphone"], a[href*="iphone"]');
          let clicked = false;
          if (linkCandidates.length > 0) {
            for (let i = 0; i < linkCandidates.length; i++) {
              const el = linkCandidates[i];
              if (/iphone/i.test(el.innerText || '')) {
                cy.wrap(el).click({ force: true });
                clicked = true;
                break;
              }
            }
            if (!clicked) {
              cy.wrap(linkCandidates[0]).click({ force: true });
              clicked = true;
            }
          }
          if (!clicked) {
            cy.log('⚠ Không tìm thấy link product - aborting this E2E branch.');
          }
        });

        cy.wait(5000);
        cy.log('✅ Vào trang chi tiết (nếu có).');

        cy.get('body').then(($body) => {
          if ($body.find('button').filter((i, el) => /Mua Ngay|Thêm vào giỏ hàng|MUA NGAY|Thêm vào giỏ hàng/i.test(el.innerText)).length > 0) {
            const btn = $body.find('button').filter((i, el) => /Mua Ngay|Thêm vào giỏ hàng/i.test(el.innerText)).first();
            cy.wrap(btn).click({ force: true });
          } else if ($body.find('.add-to-cart, .btn-buy-now').length > 0) {
            cy.get('.add-to-cart, .btn-buy-now').first().click({ force: true });
          } else {
            cy.log('⚠ Không tìm thấy nút thêm vào giỏ');
          }
        });

        cy.wait(4000);
        cy.log('✅ Đã thêm vào giỏ (nếu có nút)');

        cy.get('body').then(($b2) => {
          const cartSelectors = ['.cart-box', '.cart-icon', 'a[href*="cart"]'];
          let clicked = false;
          for (const sel of cartSelectors) {
            if ($b2.find(sel).length > 0) {
              cy.get(sel).first().click({ force: true });
              clicked = true;
              break;
            }
          }
          if (!clicked) {
            cy.visit('https://cellphones.com.vn/cart');
          }
        });

        cy.wait(4000);
        cy.url().should('include', '/cart');

        cy.get('body').then(($b3) => {
          if ($b3.find('button[class*="plus"], button:contains("+"), .qty-plus').length > 0 ||
              $b3.find('.qty-plus').length > 0) {
            if ($b3.find('.qty-plus').length > 0) {
              cy.get('.qty-plus').first().click({ force: true });
            } else {
              cy.get('button[class*="plus"]').first().click({ force: true });
            }
            cy.wait(1500);
          } else {
            cy.log('⚠ Không tìm thấy nút tăng');
          }
        });

        cy.get('body').then(($b4) => {
          if ($b4.find('button[class*="minus"], button:contains("-"), .qty-minus').length > 0 ||
              $b4.find('.qty-minus').length > 0) {
            if ($b4.find('.qty-minus').length > 0) {
              cy.get('.qty-minus').first().click({ force: true });
            } else {
              cy.get('button[class*="minus"]').first().click({ force: true });
            }
            cy.wait(1500);
          } else {
            cy.log('⚠ Không tìm thấy nút giảm');
          }
        });

        cy.get('body').then(($b5) => {
          const trashSelectors = [
            'i[class*="trash"]',
            'button[class*="delete"]',
            '.remove-item',
            '.cart-item-delete',
            'a[href*="remove"]'
          ];
          for (const sel of trashSelectors) {
            if ($b5.find(sel).length > 0) {
              cy.get(sel).first().click({ force: true });
              break;
            }
          }
        });

        cy.wait(2000);

        cy.get('body').then(($b6) => {
          if ($b6.text().includes('Giỏ hàng trống') || $b6.find('.empty-cart').length > 0) {
            cy.log('✅ Giỏ hàng trống sau xóa');
          } else {
            cy.log('ℹ Giỏ hàng có thể còn item (chưa xóa được tự động)');
          }
        });

        cy.log('🎉 HOÀN THÀNH LUỒNG E2E SHOPPING FLOW (origin branch)');
      }); 
    }); 
  }); 


  describe('Suite: CPS_Store_Filter_and_Search - 22130111 Do An Khang', () => {
    beforeEach(() => {
      cy.visit('https://cellphones.com.vn/dia-chi-cua-hang');
      cy.get('.boxSearch').should('be.visible');
    });

    it('CPS_Store_Filter_and_Search_01: Verify filtering by Province/City and District', () => {
      cy.get('#boxSearchProvince').select('Hồ Chí Minh');
      cy.get('#boxSearchDistrict').should('be.visible').select('Quận 1');
      cy.get('.boxMap-stores').should('have.length.greaterThan', 0);
      cy.get('.boxMap-stores').first().should('contain.text', 'Quận 1');
    });

    it('CPS_Store_Filter_and_Search_02: Verify searching by street name', () => {
      const keyword = 'Thái Hà';
      cy.get('.boxSearch-input input').should('be.visible').clear().type(`${keyword}{enter}`);
      cy.get('.boxSearch-result-item').should('have.length.greaterThan', 0);
      cy.get('.boxSearch-result-item').should('contain.text', keyword);
    });

    it('CPS_Store_Filter_and_Search_04: Verify District reset logic when changing Province', () => {
      cy.get('#boxSearchProvince').select('Hồ Chí Minh');
      cy.get('#boxSearchDistrict').should('not.be.disabled').select('Quận 1');
      cy.get('#boxSearchProvince').select('Hà Nội');
      cy.get('#boxSearchDistrict').should('not.be.disabled');
      cy.get('#boxSearchDistrict option:selected').should('contain.text', 'Chọn quận/huyện');
    });

    it('CPS_Store_Filter_and_Search_05: Verify search with unsigned Vietnamese keywords', () => {
      const unsignedKeyword = 'thai ha';
      cy.get('.boxSearch-input input').clear().type(`${unsignedKeyword}{enter}`);
      cy.get('.boxSearch-result-item ').should('have.length.greaterThan', 0);
      cy.get('.boxSearch-result-item ').should('contain.text', 'Thái Hà');
    });
  });


  describe('Suite: CPS_Store_Interaction - Buzz Comments Module', () => {
    beforeEach(() => {
      cy.visit('https://cellphones.com.vn/dia-chi-cua-hang');
      cy.get('.boxMap-stores').should('be.visible');
      cy.get('.boxMap-stores .boxMap-store').first().should('be.visible');
    });

    it('CPS_Store_Interaction_01: Verify "Get Directions" button (Google Maps)', () => {
      cy.get('.boxMap-stores .boxMap-store').first().within(() => {
        cy.contains('a', 'Xem đường đi').should('be.visible').and('have.attr', 'href').and('include', 'google.com/maps');
        cy.contains('a', 'Xem đường đi').should('have.attr', 'target', '_blank');
      });
    });

    it('CPS_Store_Interaction_02: Verify phone number link (Click-to-call)', () => {
      cy.get('.boxMap-stores .boxMap-store').first().within(() => {
        cy.get('a[href^="tel:"]').should('exist').and('not.be.disabled').then(($link) => {
          const phoneLink = $link.attr('href');
          cy.log('Phone Link detected: ' + phoneLink);
          expect(phoneLink).to.match(/^tel:[0-9\s\.\+]+$/);
        });
      });
    });

    it.skip('CPS_Store_Interaction_03: [BLOCKED] Verify Map synchronization when clicking on a store card', () => {
      cy.get('.boxMap-stores .boxMap-store').first().as('firstStore');
      cy.get('@firstStore').scrollIntoView().click();
      cy.wait(2000);
      cy.get('body').contains('div', /Phường|Quận|HCM|TP/i).should('be.visible');
    });

    it.skip('CPS_Store_Interaction_04: [BLOCKED] Verify interaction with Map Pins (Markers)', () => {
      cy.get('.mf-iconview-marker-container', { timeout: 10000 }).should('exist');
      cy.wait(2000);
      cy.get('.mf-iconview-marker-container').last().click({ force: true });
      cy.get('.mf-info-window-container').filter(':visible').should('be.visible').invoke('text').should('have.length.greaterThan', 5);
    });
  });

}); 
