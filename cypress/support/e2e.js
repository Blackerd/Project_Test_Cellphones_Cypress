// cypress/support/e2e.js

// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// =========================================================
// CẤU HÌNH BẮT LỖI UNCAUGHT EXCEPTION (Script Error)
// =========================================================
// Sự kiện này lắng nghe các lỗi không được bắt (uncaught errors) 
// từ ứng dụng web (thường là lỗi Cross-Origin từ quảng cáo hoặc tracker).
Cypress.on('uncaught:exception', (err, runnable) => {
    // Nếu lỗi là 'Script error.' (lỗi cross-origin) hoặc là một 
    // uncaught exception chung, chúng ta bỏ qua nó để test case không bị fail.
    if (err.message.includes('Script error.') || /uncaught exception/i.test(err.message)) {
        console.log('⚠️ Bỏ qua lỗi ứng dụng không mong muốn (Cross-Origin Script Error)');
        // Trả về false để ngăn Cypress tự động fail test khi gặp lỗi này
        return false; 
    }
    
    // Nếu là lỗi khác, vẫn để Cypress báo fail
    return true;
});
