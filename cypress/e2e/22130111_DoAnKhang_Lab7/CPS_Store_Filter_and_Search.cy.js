describe('Suite: CPS_Store_Filter_and_Search', () => {

    // --- 1. IGNORE APP ERRORS ---
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('t.map.moveCamera') || 
          err.message.includes('Cannot read properties of null') ||
          err.message.includes('clientWidth') ||
          err.message.includes('Script error')) {
        return false;
      }
      return true;
    });
    
  // PRECONDITION: Chạy trước mỗi test case
  beforeEach(() => {
    // 1. Truy cập trang
    cy.visit('https://cellphones.com.vn/dia-chi-cua-hang');
    
    // 2. Chờ box search load xong
    cy.get('.boxSearch').should('be.visible');
  });

  // --- TC 01: Happy Path (Filter) ---
  it('CPS_Store_Filter_and_Search_01: Verify filtering by Province/City and District', () => {
    // 1. Chọn Tỉnh/Thành phố
    cy.get('#boxSearchProvince').select('Hồ Chí Minh');
    
    // 2. Chọn Quận/Huyện
    // Chọn "Quận 1"
    cy.get('#boxSearchDistrict').should('be.visible').select('Quận 1');

    // 3. Validation: Kiểm tra danh sách kết quả hiển thị
    // Chờ list load và kiểm tra có item bên trong
    cy.get('.boxMap-stores').should('have.length.greaterThan', 0);
    
    // Kiểm tra text của item đầu tiên có chứa "Quận 1"
    cy.get('.boxMap-stores').first().should('contain.text', 'Quận 1');
  });

  // --- TC 02: Search Keyword ---
  it('CPS_Store_Filter_and_Search_02: Verify searching by street name', () => {
    const keyword = 'Thái Hà';

    // 1. Tìm ô input dựa trên class cha .boxSearch-input
    cy.get('.boxSearch-input input')
      .should('be.visible')
      .clear() // Xóa text cũ nếu có
      .type(`${keyword}{enter}`); // Nhập từ khóa và nhấn Enter

    // 2. Validation
    cy.get('.boxSearch-result-item').should('have.length.greaterThan', 0);
    cy.get('.boxSearch-result-item').should('contain.text', keyword);
  });

  // --- TC 03: No Results ---
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

  // --- TC 04: Reset Logic (Quan trọng) ---
  it('CPS_Store_Filter_and_Search_04: Verify District reset logic when changing Province', () => {
    // SETUP: Select HCM -> Quan 1
    cy.get('#boxSearchProvince').select('Hồ Chí Minh');
    cy.get('#boxSearchDistrict').should('not.be.disabled').select('Quận 1');
    
    // ACTION: Change Province to Ha Noi
    cy.get('#boxSearchProvince').select('Hà Nội');

    // 1. Chờ cho ô District không bị disable (để đảm bảo API đã phản hồi)
    cy.get('#boxSearchDistrict').should('not.be.disabled');

    // 2. Dùng .should() để Cypress tự động đợi text chuyển từ "Quận 1" -> "Chọn quận/huyện"
    // Lưu ý: Dùng 'contain' để tránh lỗi do khoảng trắng thừa
    cy.get('#boxSearchDistrict option:selected')
      .should('contain.text', 'Chọn quận/huyện'); 
  });

  // --- TC 05: Unsigned Keyword ---
  it('CPS_Store_Filter_and_Search_05: Verify search with unsigned Vietnamese keywords', () => {
    const unsignedKeyword = 'thai ha';
    
    // 1. Nhập từ khóa không dấu
    cy.get('.boxSearch-input input')
      .clear()
      .type(`${unsignedKeyword}{enter}`);

    // 2. Validation: Hệ thống vẫn phải hiểu và trả về kết quả có dấu "Thái Hà"
    cy.get('.boxSearch-result-item ').should('have.length.greaterThan', 0);
    cy.get('.boxSearch-result-item ').should('contain.text', 'Thái Hà');
  });

});