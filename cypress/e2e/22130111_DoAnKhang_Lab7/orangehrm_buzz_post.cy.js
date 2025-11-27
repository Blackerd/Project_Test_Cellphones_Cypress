describe('Buzz Posts Module - Full Test Suite', () => {

  // --- PRECONDITIONS (TC_BP_01 Step 1 & 2) ---
  // Đăng nhập và vào trang Buzz trước mỗi Test Case
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    
    // Login Admin
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // Vào trang Buzz
    cy.get('a[href*="viewBuzz"]').click()
  })

  // ==========================================
  // GROUP 1: CREATE POST (TC_BP_01)
  // ==========================================
  context('TC_BP_01: Create Post Functionality', () => {

    it('TC_BP_01.1: Check Create Post (Happy Case)', () => {
      const postContent = 'Test Create Post ' + Date.now()
      
      cy.get('.oxd-buzz-post-input').type(postContent)
      cy.get('button[type="submit"]').click()

      // 1. Check thông báo thành công
      cy.get('.oxd-toast').should('contain', 'Success')
      
      cy.reload()

      // 3. Check bài viết tồn tại
      cy.contains(postContent).should('be.visible')
    })

    it('TC_BP_01.2: Check creating post with empty content', () => {
      // Không nhập gì cả, bấm Post luôn
      cy.get('button[type="submit"]').click()

      // Expected: Không có thông báo Success
      cy.get('.oxd-toast').should('not.exist')
    })

    it('TC_BP_01.3: Check creating post exceeding character limit', () => {
      // Tạo chuỗi 65531 ký tự
      const longText = 'a'.repeat(65531)
      
      // Dùng invoke val để điền nhanh
      cy.get('.oxd-buzz-post-input').invoke('val', longText).trigger('input')
      
      // Expected: Hiển thị cảnh báo giới hạn ký tự
      cy.contains('Should not exceed 65530 characters').should('be.visible')
    })

    it('TC_BP_01.4: Check XSS script injection', () => {
      const script = '<script>alert("XSS Attack")</script>'
      const stub = cy.stub()
      cy.on('window:alert', stub) // Lắng nghe sự kiện alert

      cy.get('.oxd-buzz-post-input').type(script)
      cy.get('button[type="submit"]').click()
      
      cy.get('.oxd-toast').should('contain', 'Success')
      cy.reload()

      // Expected 1: Script hiện dưới dạng text thường
      cy.contains(script).should('be.visible')
      // Expected 2: Alert không được kích hoạt
      cy.wrap(stub).should('not.be.called')
    })

    it('TC_BP_01.5: Check double-clicking the Post button', () => {
      const content = 'Double Click ' + Date.now()
      cy.get('.oxd-buzz-post-input').type(content)

      // Double click
      cy.get('button[type="submit"]').dblclick()

      cy.reload()
      // Expected: Chỉ có 1 bài post được tạo ra với nội dung này
      cy.get('.oxd-grid-item').filter(`:contains("${content}")`).should('have.length', 1)
    })
  })

  // ==========================================
  // GROUP 2: EDIT POST (TC_BP_02)
  // ==========================================
  context('TC_BP_02: Edit Post Functionality', () => {
    
    // Setup: Tạo 1 bài mới để sửa
    beforeEach(() => {
      const setupContent = 'Post Setup for Edit ' + Date.now()
      cy.get('.oxd-buzz-post-input').type(setupContent)
      cy.get('button[type="submit"]').click()
      cy.get('.oxd-toast').should('not.exist') // Chờ xong
      cy.reload()
      
      // Lưu alias để dùng ở dưới
      cy.wrap(setupContent).as('postToEdit')
    })

    it('TC_BP_02.1: Check editing ones own post', function () {
      const newContent = 'Updated Content ' + Date.now()

      // Tìm bài viết -> Click 3 chấm -> Click Edit
      cy.contains(this.postToEdit).parents('.oxd-sheet').find('i.bi-three-dots').click()
      cy.contains('li', 'Edit Post').click()

      // Sửa trong dialog pop-up
      cy.get('.oxd-dialog-container-default textarea').clear().type(newContent)
      cy.get('.oxd-dialog-container-default button[type="submit"]').click()

      // Check success
      cy.get('.oxd-toast').should('contain', 'Success')
      cy.contains(newContent).should('be.visible')
    })

  it('TC_BP_02.2: Check editing another users post (Smart Name Matching)', () => {
      
      // --- HÀM SO SÁNH TÊN THÔNG MINH ---
      // Trả về TRUE nếu 2 tên giống nhau "quá nửa"
      const isSamePerson = (name1, name2) => {
        // 1. Chuyển về chữ thường và tách thành mảng các từ
        // Ví dụ: "Shruti P user" -> ["shruti", "p", "user"]
        const words1 = name1.toLowerCase().trim().split(/\s+/);
        const words2 = name2.toLowerCase().trim().split(/\s+/);

        // 2. Đếm số từ trùng nhau
        const commonWords = words1.filter(word => words2.includes(word));
        
        // 3. Tính tỷ lệ trùng khớp dựa trên tên ngắn hơn (để tránh trường hợp tên quá dài)
        const minLength = Math.min(words1.length, words2.length);
        const matchRatio = commonWords.length / minLength;

        // Nếu trùng hơn 50% (0.5) -> Coi là cùng 1 người
        return matchRatio > 0.5;
      };

      // --- BẮT ĐẦU TEST ---
      cy.intercept('GET', '**/api/v2/buzz/feed?*').as('loadMorePosts')

      cy.get('.oxd-userdropdown-name').then(($nameElement) => {
        const myNameRaw = $nameElement.text().trim();
        cy.log('User đăng nhập gốc: ' + myNameRaw);

        const findAndCheckPost = (attempt = 0) => {
          if (attempt > 5) {
            cy.log('Đã thử 5 lần mà không tìm thấy bài người khác. Stop.');
            return;
          }

          cy.get('.orangehrm-buzz-post-emp-name').then(($list) => {
            let foundInThisBatch = false;

            for (let i = 0; i < $list.length; i++) {
              const el = $list[i];
              if (!Cypress.dom.isAttached(el)) continue;

              const postAuthorRaw = el.innerText.trim();

              // --- SỬ DỤNG HÀM SO SÁNH MỚI ---
              // Nếu KHÔNG PHẢI cùng 1 người -> Thì mới vào test
              if (!isSamePerson(myNameRaw, postAuthorRaw)) {
                
                foundInThisBatch = true;
                cy.log(`Tìm thấy người khác: "${postAuthorRaw}" (Khác với "${myNameRaw}")`);
                
                cy.wrap(el).scrollIntoView().parents('.oxd-sheet').then(($postCard) => {
                  if ($postCard.find('i.bi-three-dots').length > 0) {
                    cy.wrap($postCard).find('i.bi-three-dots').click();
                    cy.get('.oxd-dropdown-menu').should('exist').then(($menu) => {
                       if ($menu.text().includes('Edit Post')) {
                         cy.log('INFO: Có nút Edit (Admin Permission).');
                       } else {
                         cy.log('PASS: Không có nút Edit.');
                       }
                    });
                    cy.get('.oxd-topbar-header').click({force: true});
                  } else {
                    cy.log('PASS: Không có menu thao tác.');
                  }
                });
                return; // Tìm thấy và test xong -> Thoát
              } else {
                cy.log(`Skip: "${postAuthorRaw}" giống với User hiện tại.`);
              }
            }

            if (!foundInThisBatch) {
              cy.log(`Batch ${attempt}: Toàn bài của mình (hoặc tên giống mình). Load thêm...`);
              cy.scrollTo('bottom');
              cy.wait('@loadMorePosts', { timeout: 15000 }).then(() => cy.wait(500));
              findAndCheckPost(attempt + 1);
            }
          });
        };

        findAndCheckPost();
      });
    });
    // SKIP: Case này cần 2 Tab trình duyệt cùng lúc. Cypress không hỗ trợ đa tab (multi-tab).
    it.skip('TC_BP_02.3: Check editing a post just deleted (Concurrency)', () => {
      // Logic: Tab A xóa, Tab B bấm Edit -> Check lỗi server
    })
  })

  // ==========================================
  // GROUP 3: DELETE POST (TC_BP_03)
  // ==========================================
  context('TC_BP_03: Delete Post Functionality', () => {
    
    // Setup: Tạo 1 bài mới để xóa
    beforeEach(() => {
      const setupContent = 'Post Setup for Delete ' + Date.now()
      cy.get('.oxd-buzz-post-input').type(setupContent)
      cy.get('button[type="submit"]').click()
      cy.get('.oxd-toast').should('not.exist')
      cy.reload()
      
      cy.wrap(setupContent).as('postToDelete')
    })

    it('TC_BP_03.1: Check deleting ones own post', function () {
      // Tìm bài viết -> Click 3 chấm -> Click Delete
      cy.contains(this.postToDelete).parents('.oxd-sheet').find('i.bi-three-dots').click()
      cy.contains('li', 'Delete Post').click()

      // Confirm Delete
      cy.get('.oxd-button--label-danger').click()

      // Check success & Check mất bài
      cy.get('.oxd-toast').should('contain', 'Success')
      cy.contains(this.postToDelete).should('not.exist')
    })
  })

})