describe('Lab7 - The Internet App - Comprehensive Test Suite (Slowed Down)', () => {

    const targetEmail = 'fbach@yahoo.com'; 
    const formUrl = 'https://the-internet.herokuapp.com';

    // ===============================================================
    // 1. CONTEXT: Mô phỏng Quản lý LOCATIONS (CRUD trên Bảng Dữ liệu)
    // ===============================================================
    context('A. CRUD Simulation on Data Tables (Locations/Users List)', () => {
        
        const dataTableUrl = formUrl + '/tables';

        beforeEach(() => {
            cy.visit(dataTableUrl);
            cy.log('Đã truy cập trang Data Tables');
            cy.wait(5000); 
        });

        // C - CREATE Simulation: Kiểm tra sự tồn tại của bản ghi Jason Doe
        it('A1 - Simulate ADD NEW Location/User (Verify Jason Doe Record)', () => {
            cy.log('*** A1: Kiểm tra bản ghi của Jason Doe (LastName "Doe") ***');
            
            cy.get('#table1').within(() => {
                cy.contains('td', 'Doe')
                  .parents('tr')
                  .should('have.length', 1) 
                  .and('contain', 'Jason')     
                  .and('contain', '$100.00');  
            });
            cy.wait(5000); 
            cy.log('Bản ghi Jason Doe đã được xác minh thành công.');
        });

        // R - READ/SEARCH (Tìm kiếm và Xác minh)
        it('A2 - Search and Verify a specific record (READ)', () => {
            cy.log(`*** A2: Tìm kiếm và xác minh email: ${targetEmail} ***`);
            
            cy.get('#table1').within(() => {
                cy.contains('tr', targetEmail) 
                  .should('be.visible')
                  .within(() => {
                      cy.get('td:nth-child(2)').should('contain', 'Frank');   
                      cy.wait(5000); 
                      cy.get('td:nth-child(4)').should('contain', '$51.00'); 
                  });
            });
            cy.log('Dữ liệu đã được tìm thấy và xác minh.');
        });

        // U - UPDATE Simulation (Click nút Edit)
        it('A3 - Simulate EDIT action on a record', () => {
            cy.log(`*** A3: Mô phỏng Click nút Edit của bản ghi: ${targetEmail} ***`);

            cy.get('#table1').contains('tr', targetEmail)
                .within(() => {
                    cy.contains('a', 'edit').click();
                });
            
            cy.wait(1000); // Tạm dừng 1 giây để quan sát hành động click
            cy.url().should('include', '/tables#'); 
            cy.log('Đã click nút Edit thành công.');
        });

        // D - DELETE Simulation (Click nút Delete)
        it('A4 - Simulate DELETE action on a record', () => {
            cy.log(`*** A4: Mô phỏng Click nút Delete của bản ghi: ${targetEmail} ***`);

            cy.get('#table1').contains('tr', targetEmail)
                .within(() => {
                    cy.contains('a', 'delete').click();
                });
            
            cy.wait(1000); // Tạm dừng 1 giây để quan sát hành động click
            cy.url().should('include', '/tables#');
            cy.log('Đã click nút Delete thành công.');
        });

    });

    // ----------------------------------------------------------------------------------
    
    // ===============================================================
    // 2. CONTEXT: Mô phỏng GENERAL INFORMATION (Update Form)
    // ===============================================================
    context('B. Form Update Simulation (General Information)', () => {

        // U - UPDATE Checkboxes (Toggles Settings)
        it('B1 - Simulate Form Update: Checkboxes (Toggle Settings)', () => {
            cy.log('*** B1: Update: Thay đổi trạng thái Checkbox ***');
            cy.visit(formUrl + '/checkboxes');
            cy.wait(5000);
            
            // 1. Chọn Checkbox 1 
            cy.get('#checkboxes input:nth-child(1)')
                .should('not.be.checked')
                .check()
                .should('be.checked');
            cy.wait(5000);
                
            // 2. Bỏ chọn Checkbox 2 
            cy.get('#checkboxes input:nth-child(3)')
                .should('be.checked')
                .uncheck()
                .should('not.be.checked');
            cy.wait(5000);

            cy.log('Đã cập nhật thành công các Checkbox.');
        });

        // U - UPDATE Text Input (Updating Name/Address)
        it('B2 - Simulate Form Update: Text Input (Updating Info)', () => {
            cy.log('*** B2: Update: Thay đổi giá trị Text Input ***');
            cy.visit(formUrl + '/inputs'); 
            cy.wait(5000);

            const newTextValue = '54321';

            // 1. Xóa nội dung cũ và nhập giá trị mới
            cy.get('input[type="number"]') 
                .clear()
                .type(newTextValue);
            
            cy.wait(5000);
            cy.get('input[type="number"]').should('have.value', newTextValue); 

            cy.log('Đã cập nhật thành công trường text input.');
        });

        // U - UPDATE Dropdown (Selecting Options)
        it('B3 - Simulate Form Update: Dropdown (Selecting Options)', () => {
            cy.log('*** B3: Update: Thay đổi lựa chọn Dropdown ***');
            cy.visit(formUrl + '/dropdown'); 
            cy.wait(5000);

            const optionText = 'Option 2';

            // 1. Chọn một tùy chọn từ Dropdown
            cy.get('#dropdown') 
                .select(optionText); 
            
            cy.wait(5000);
            cy.get('#dropdown').should('have.value', '2'); 
            
            cy.log(`Đã chọn thành công: ${optionText}`);
        });

    });

});
