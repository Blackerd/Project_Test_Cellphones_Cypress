describe('Suite: Defect', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('t.map.moveCamera') ||
            err.message.includes('Cannot read properties of null') ||
            err.message.includes('clientWidth') ||
            err.message.includes('Script error')) {
            return false;
        }
        return true;
    });

    beforeEach(() => {
        // 1. Truy cập trang
        cy.visit('https://cellphones.com.vn/dia-chi-cua-hang');

        // 2. Chờ box search load xong
        cy.get('.boxSearch').should('be.visible');
    });

    it('CPS_Store_Filter_and_Search_03: Verify search with no results', () => {
        const nonsenseKey = 'abcdxyz';

        // 1. Nhập từ khóa vô nghĩa
        cy.get('.boxSearch-input input')
            .clear()
            .type(`${nonsenseKey}{enter}`);

        cy.wait(1000); // Chờ load kết quả
        // 2. Validation: Không được tồn tại item cửa hàng nào
        cy.get('.boxSearch-result-item').should('not.exist');

    });

    it('TC_02: [BUG DEMO] Should detect invalid "Store-to-Store" routing when Location BLOCKED', () => {

        cy.visit('https://cellphones.com.vn/dia-chi-cua-hang', {
            onBeforeLoad(win) {
                cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success, error) => {
                    return error({ code: 1 });
                });
            },
        });

        // 2. Action & Assertion
        cy.get('.boxMap-stores .boxMap-store').first().within(() => {

            cy.contains('a', 'Xem đường đi')
                .should('have.attr', 'href')
                .then((href) => {
                    cy.log(`🔗 Link thực tế bắt được: ${href}`);

                    expect(href).not.to.include('saddr=', 'Bug detected: Link contains source address (saddr)');

                    expect(href).not.to.match(/saddr=\d+\.\d+/, 'Bug detected: saddr contains coordinates');

                });
        });
    });


    it('CPS_Store_UI_008: Verify "Direct Icon" is clickable and has valid link', () => {
    
    // 1. Truy cập trang
    cy.visit('https://cellphones.com.vn/dia-chi-cua-hang');

    // 2. Tìm icon chỉ đường
    // KỲ VỌNG: Icon phải hiển thị và có link
    cy.get('.mf-direct-icon')
      .should('exist')           // 1. Phải tồn tại trong DOM
      .and('be.visible')         // 2. Phải nhìn thấy được (không được 0x0 px)
      .and('have.attr', 'href')  // 3. Bắt buộc phải có thuộc tính href
      .and('not.be.empty');      // 4. href không được rỗng
      
  });


});