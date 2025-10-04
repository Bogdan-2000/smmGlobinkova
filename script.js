document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const phoneInput = form.querySelector('input[type="tel"]');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0 && value[0] !== '3') {
            value = '380' + value;
        }
        
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        
        let formatted = '';
        if (value.length > 0) {
            formatted = '+';
            if (value.length <= 3) {
                formatted += value;
            } else if (value.length <= 5) {
                formatted += value.slice(0, 3) + ' (' + value.slice(3);
            } else if (value.length <= 8) {
                formatted += value.slice(0, 3) + ' (' + value.slice(3, 5) + ') ' + value.slice(5);
            } else if (value.length <= 10) {
                formatted += value.slice(0, 3) + ' (' + value.slice(3, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8);
            } else {
                formatted += value.slice(0, 3) + ' (' + value.slice(3, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8, 10) + '-' + value.slice(10);
            }
        }
        
        e.target.value = formatted;
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = form.querySelector('input[type="text"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const message = form.querySelector('textarea').value.trim();
        
        if (name.length < 2) {
            showNotification('Будь ласка, введіть коректне ім\'я', 'error');
            return;
        }
        
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length !== 12 || !phoneDigits.startsWith('380')) {
            showNotification('Будь ласка, введіть коректний номер телефону у форматі +380 XX XXX XX XX', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Будь ласка, введіть коректний email', 'error');
            return;
        }
        
        const telegramApiToken = '7965648457:AAGyy8boPO1T_4XmQBqVrgRkEOB3zVx5J3M';
        const chatId = '900891446';
        const telegramMessage = `
            Нова заявка з сайту:
            Ім'я: ${name}
            Телефон: ${phone}
            Email: ${email}
            Про бізнес: ${message || 'Не вказано'}`;
        
        showLoadingState(true);
        
        fetch(`https://api.telegram.org/bot${telegramApiToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage
            })
        })
        .then(response => response.json())
        .then(data => {
            showLoadingState(false);
            if (data.ok) {
                showNotification('Дякуємо за заявку! Ми зв\'яжемося з вами найближчим часом.', 'success');
                form.reset();
            } else {
                showNotification('Помилка при відправці заявки. Спробуйте ще раз.', 'error');
            }
        })
        .catch(() => {
            showLoadingState(false);
            showNotification('Помилка при відправці заявки. Спробуйте ще раз.', 'error');
        });
    });
});

function showLoadingState(isLoading) {
    const button = document.querySelector('.contact-form .btn');
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Відправка...';
        button.style.opacity = '0.6';
    } else {
        button.disabled = false;
        button.textContent = 'Відправити заявку';
        button.style.opacity = '1';
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
    const primaryBtn = document.querySelector('.header-section .btn.primary');
    const secondaryBtn = document.querySelector('.header-section .btn.secondary');
    
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('.contact-section');
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                const firstInput = document.querySelector('.contact-form input[type="text"]');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 800);
        });
    }
    
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const servicesSection = document.querySelector('.services-section');
            servicesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
});