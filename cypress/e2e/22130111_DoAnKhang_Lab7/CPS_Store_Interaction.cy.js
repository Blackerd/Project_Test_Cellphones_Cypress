describe('Suite: CPS_Store_Interaction', () => {

  // --- 1. IGNORE APP ERRORS ---
  // Vẫn giữ đoạn này để TC 01, 02 chạy mượt mà không bị web làm crash
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('t.map.moveCamera') ||
      err.message.includes('Cannot read properties of null') ||
      err.message.includes('clientWidth') ||
      err.message.includes('Script error')) {
      return false;
    }
    return true;
  });

  // --- 2. PRECONDITION ---
  beforeEach(() => {
    cy.visit('https://cellphones.com.vn/dia-chi-cua-hang');
    cy.get('.boxMap-stores').should('be.visible');
    // Kiểm tra item đầu tiên load xong (Dùng class .boxMap-store cho chuẩn xác)
    cy.get('.boxMap-stores .boxMap-store').first().should('be.visible');
  });

  // --- TC 01: Happy Path - Run Normally ---
  it('CPS_Store_Interaction_01: Verify "Get Directions" button (Google Maps)', () => {

    cy.get('.boxMap-stores .boxMap-store').first().within(() => {

      // Verify link Xem đường đi tồn tại và đúng format

      cy.contains('a', 'Xem đường đi')

        .should('be.visible')

        .and('have.attr', 'href')

        .and('include', 'google.com/maps');



      cy.contains('a', 'Xem đường đi')

        .should('have.attr', 'target', '_blank');

    });


  });
  // --- TC 02: BUG DEMO - Blocked Location Permission ---
 it('CPS_Store_Interaction_02: BUG DEMO - Blocked Location Permission', () => {
    
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

  // --- TC 03: Happy Path - Run Normally ---
  it('CPS_Store_Interaction_03: Verify phone number link (Click-to-call)', () => {
    cy.get('.boxMap-stores .boxMap-store').first().within(() => {
      // Verify link số điện thoại (tel:)
      cy.get('a[href^="tel:"]')
        .should('exist')
        .and('not.be.disabled')
        .then(($link) => {
          const phoneLink = $link.attr('href');
          cy.log('Phone Link detected: ' + phoneLink);
          expect(phoneLink).to.match(/^tel:[0-9\s\.\+]+$/);
        });
    });
  });

  // --- TC 04: BLOCKED (Sử dụng it.skip) ---
  // Note: Automation cannot verify Map synchronization due to Google Maps Shadow DOM/Canvas latency.
  // Manual Test Result: PASS
  it.skip('CPS_Store_Interaction_04: [BLOCKED] Verify Map synchronization when clicking on a store card', () => {
    // Code logic vẫn giữ lại để tham khảo (nhưng sẽ không chạy)
    cy.get('.boxMap-stores .boxMap-store').first().as('firstStore');
    cy.get('@firstStore').scrollIntoView().click();

    // Validation logic (Tạm khóa)
    cy.wait(2000);
    cy.get('body').contains('div', /Phường|Quận|HCM|TP/i).should('be.visible');
  });

  // --- TC 05: BLOCKED (Sử dụng it.skip) ---
  // Note: Automation cannot interact reliably with Google Maps Markers (Canvas elements).
  // Manual Test Result: PASS
  it.skip('CPS_Store_Interaction_05: [BLOCKED] Verify interaction with Map Pins (Markers)', () => {
    // Code logic vẫn giữ lại
    cy.get('.mf-iconview-marker-container', { timeout: 10000 }).should('exist');
    cy.wait(2000);

    cy.get('.mf-iconview-marker-container').last().click({ force: true });

    cy.get('.mf-info-window-container')
      .filter(':visible')
      .should('be.visible')
      .invoke('text')
      .should('have.length.greaterThan', 5);
  });

  it('CPS_Store_Interaction_06: Verify "Direct Icon" is clickable and has valid link', () => {
    
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