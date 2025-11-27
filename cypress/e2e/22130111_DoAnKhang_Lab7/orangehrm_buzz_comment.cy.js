describe('Buzz Comments Module - Final Fixed Version (Correct Selectors)', () => {

  Cypress.on('uncaught:exception', () => false)

  beforeEach(() => {
    // Login
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // Vào trang Buzz
    cy.get('a[href*="viewBuzz"]').click()
    cy.get('.orangehrm-buzz-newsfeed').should('be.visible')
    cy.wait(2000) 
  })

  // ==============================================================
  // GROUP 1: CREATE COMMENT
  // ==============================================================
  context('TC_BC_01: Create Comment', () => {

    beforeEach(() => {
      const postContent = 'Post for Comment UI ' + Date.now()
      cy.get('.oxd-buzz-post-input').should('be.visible').type(postContent)
      cy.wait(1000) 
      cy.get('.oxd-buzz-post-slot button[type="submit"]').click()
      cy.wait(3000)
      cy.reload()
      
      cy.contains(postContent).should('be.visible')
      cy.wrap(postContent).as('postTarget')
    })

    it('TC_BC_01.1: Check creating a comment successfully', function() {
      const commentText = 'Simple UI Comment ' + Date.now()

      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('i.bi-chat-text-fill').click()

      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('input[placeholder="Write your comment..."]')
        .type(`${commentText}{enter}`)

      cy.wait(3000)
      cy.contains(commentText).should('be.visible')
    })

    it('TC_BC_01.2: Check creating an empty comment', function() {
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('i.bi-chat-text-fill').click()

      // Nhập rỗng
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('input[placeholder="Write your comment..."]')
        .type('{enter}')
      
      cy.wait(1000)

      // Kiểm tra dòng stats vẫn là "0 Comments"
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('.orangehrm-buzz-stats-active') // Class lấy từ HTML bạn gửi
        .should('contain', '0 Comments') 
    })

    it('TC_BC_01.3: Check creating a comment with XSS', function() {
      const script = '<script>alert(1)</script>'
      const stub = cy.stub()
      cy.on('window:alert', stub)

      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('i.bi-chat-text-fill').click()

      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('input[placeholder="Write your comment..."]')
        .type(`${script}{enter}`)
      
      cy.wait(3000)
      cy.contains(script).should('be.visible')
      cy.wrap(stub).should('not.be.called')
    })
  })

  // ==============================================================
  // GROUP 2: EDIT COMMENT
  // ==============================================================
  context('TC_BC_02: Edit Comment', () => {

    beforeEach(() => {
      const postContent = 'Post for Edit UI ' + Date.now()
      const myComment = 'Original UI Comment ' + Date.now()

      // Tạo Post
      cy.get('.oxd-buzz-post-input').should('be.visible').type(postContent)
      cy.wait(1000)
      cy.get('.oxd-buzz-post-slot button[type="submit"]').click()
      cy.wait(3000)
      cy.reload()
      cy.contains(postContent).should('be.visible')

      // Tạo Comment
      cy.contains(postContent).parents('.oxd-sheet').find('i.bi-chat-text-fill').click()
      cy.contains(postContent).parents('.oxd-sheet')
        .find('input[placeholder="Write your comment..."]')
        .type(`${myComment}{enter}`)
      
      cy.wait(3000)
      cy.reload() // Reload xong thì comment bị ẩn đi
      
      cy.contains(postContent).should('be.visible')
      cy.wrap(postContent).as('postTarget')
      cy.wrap(myComment).as('commentTarget')
    })

    it('TC_BC_02.1: Check editing ones own comment', function() {
      const updatedContent = 'Edited Content ' + Date.now()

      // --- BƯỚC 1: BẤM MỞ RỘNG ---
      // Tìm bài viết -> Tìm dòng "1 Comments" -> Click
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('.orangehrm-buzz-stats-active') 
        .click()
      
      cy.wait(1000) // Chờ xổ xuống

      // --- BƯỚC 2: TÌM NÚT EDIT ---
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('.orangehrm-post-comment-action') // Tìm tất cả nút hành động trong bài post
        .filter(':contains("Edit")')            // Lọc lấy nút Edit
        .click({ force: true })

      // Sửa & Enter
      cy.get('input').filter((k, el) => el.value === this.commentTarget)
        .clear().type(`${updatedContent}{enter}`)

      cy.wait(3000)
      cy.contains(updatedContent).should('be.visible')
    })
  })

  // ==============================================================
  // GROUP 3: DELETE COMMENT
  // ==============================================================
  context('TC_BC_03: Delete Comment', () => {

    beforeEach(() => {
      const postContent = 'Post for Delete UI ' + Date.now()
      const myComment = 'Comment to Delete ' + Date.now()

      cy.get('.oxd-buzz-post-input').should('be.visible').type(postContent)
      cy.wait(1000)
      cy.get('.oxd-buzz-post-slot button[type="submit"]').click()
      cy.wait(3000)
      cy.reload()
      cy.contains(postContent).should('be.visible')

      cy.contains(postContent).parents('.oxd-sheet').find('i.bi-chat-text-fill').click()
      cy.contains(postContent).parents('.oxd-sheet')
        .find('input[placeholder="Write your comment..."]')
        .type(`${myComment}{enter}`)
      
      cy.wait(3000)
      cy.reload()
      cy.contains(postContent).should('be.visible')

      cy.wrap(postContent).as('postTarget')
      cy.wrap(myComment).as('commentTarget')
    })

    it('TC_BC_03.1: Check deleting ones own comment', function() {
      // 1. Mở rộng (Bấm vào 1 Comments)
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('.orangehrm-buzz-stats-active')
        .click()
      cy.wait(1000)

      // 2. Tìm nút Delete trực tiếp trong bài post (đã mở rộng)
      cy.contains(this.postTarget).parents('.oxd-sheet')
        .find('.orangehrm-post-comment-action') 
        .filter(':contains("Delete")') 
        .click({ force: true })

      // 3. Confirm
      cy.get('.oxd-button--label-danger').click()

      cy.wait(3000)
      cy.contains(this.commentTarget).should('not.exist')
    })

    it.skip('TC_BC_03.2: Check post owner deleting another users comment', () => {})
    it.skip('TC_BC_03.3: Check a third-party user deleting a comment', () => {})
  })

}) 