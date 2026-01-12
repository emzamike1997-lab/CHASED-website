// ===================================
// CHASED E-Commerce - Interactive Features
// ===================================

// Cart State Management
let cart = [];
let cartCount = 0;

// Image viewer state
let currentRotation = 0;
let currentZoom = 1;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeCart();
    initializeAuth();
    initializeSellMenu();
    initializeImageViewer();
    initializeNavigation();
    initializeHeaderSearch();
    initializeProfileForms();
    initializeProductCategories();
    initializeHeaderInteractions();
    initializeMobileCart();

    // Set home section as default landing page
    navigateToSection('home');
});

function initializeMobileCart() {
    const mobileCartBtn = document.getElementById('cart-link-mobile');
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCartModal();
        });
    }
}

// ===================================
// SIDEBAR TOGGLE
// ===================================
function initializeSidebar() {
    const popButton = document.getElementById('popButton');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (popButton && sidebar && mainContent) {
        popButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            mainContent.classList.toggle('expanded');

            // Change icon based on state
            const icon = popButton.querySelector('i');
            if (sidebar.classList.contains('hidden')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-list-ul');
            } else {
                icon.classList.remove('fa-list-ul');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// ===================================
// SHOPPING CART FUNCTIONALITY
// ===================================
function initializeCart() {
    // Add cart icon to page if not exists
    createCartIcon();

    // Add click handlers to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Add click handlers to cart overlay buttons
    const cartOverlayButtons = document.querySelectorAll('.cart-overlay-btn');
    cartOverlayButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function createCartIcon() {
    // Check if cart icon already exists
    if (document.getElementById('floating-cart')) return;

    const cartHTML = `
        <div class="cart-icon-container" id="floating-cart">
            <button class="cart-button" id="cart-btn">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cart-count">0</span>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cartHTML);

    // Add click handler to show cart modal
    document.getElementById('cart-btn').addEventListener('click', showCartModal);
}

function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    // Find the product card
    const productCard = event.target.closest('.product-card');
    if (!productCard) return;

    // Extract product information
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.product-image').src;

    // Create product object
    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };

    // Add to cart
    cart.push(product);
    cartCount++;

    // Update cart count
    updateCartCount();

    // Visual feedback
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.style.backgroundColor = '#28a745';

    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const mobileCountElement = document.getElementById('cart-count-mobile');

    if (countElement) {
        countElement.textContent = cartCount;
        countElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            countElement.style.transform = 'scale(1)';
        }, 200);
    }

    if (mobileCountElement) {
        mobileCountElement.textContent = cartCount;
        mobileCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            mobileCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function showCartModal() {
    // Check if modal already exists
    let cartModal = document.getElementById('cart-modal');

    if (!cartModal) {
        const modalHTML = `
            <div class="modal" id="cart-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Shopping Cart</h2>
                        <button class="modal-close" id="close-cart-modal">&times;</button>
                    </div>
                    <div class="cart-items" id="cart-items-container"></div>
                    <div class="cart-total">
                        <h3>Total: <span id="cart-total-amount">£0</span></h3>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-primary">Proceed to Checkout</button>
                        <button class="btn btn-secondary" id="close-cart-btn">Continue Shopping</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        cartModal = document.getElementById('cart-modal');

        document.getElementById('close-cart-modal').addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        document.getElementById('close-cart-btn').addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // Update cart display
    updateCartDisplay();

    // Show modal
    cartModal.classList.add('active');
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-amount');

    if (!container || !totalElement) return;

    // Clear container
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">Your cart is empty</p>';
        totalElement.textContent = '£0';
        return;
    }

    // Add cart items
    let total = 0;
    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace('£', ''));
        total += price;

        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });

    totalElement.textContent = `£${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartCount();
    updateCartDisplay();
}

// ===================================
// USER AUTHENTICATION
// ===================================
// ===================================
// USER AUTHENTICATION
// ===================================
// Initialize Supabase Client
const supabaseUrl = 'https://keznpnwibyphyvjbslox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlem5wbndpYnlwaHl2amJzbG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODE0MzIsImV4cCI6MjA4Mzc1NzQzMn0.efisBO6y3ySFV9InD2boDIIWpBnFVpKfsMBGH7K9OTM';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function initializeAuth() {
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        updateAuthUI(session);
    });

    // Check initial session
    checkSession();
}

async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    updateAuthUI(session);
}

function updateAuthUI(session) {
    const profileSection = document.getElementById('profile-section');
    const authForms = document.getElementById('auth-forms'); // Container for login/signup forms
    const userProfile = document.getElementById('user-profile-view'); // Container for logged-in view

    // We need to modify the HTML structure slightly to separate the forms from the logged-in view
    // Since we can't easily change HTML structure in JS without potentially breaking listeners, 
    // we will toggle visibility of existing elements and inject the logged-in view if needed.

    const loginContainer = document.querySelector('.profile-container');

    if (session) {
        // User is logged in
        renderLoggedInView(session.user, loginContainer);
    } else {
        // User is logged out
        renderLoggedOutView(loginContainer);
    }
}

function renderLoggedInView(user, container) {
    const userEmail = user.email;
    const userName = user.user_metadata.full_name || 'User';

    container.innerHTML = `
        <div class="header">
            <h1 class="header-title">Welcome Back</h1>
            <p class="header-subtitle">${userName}</p>
        </div>
        
        <div class="user-dashboard" style="text-align: center; margin-top: 2rem;">
            <div class="user-avatar" style="width: 80px; height: 80px; background: #333; color: #fff; border-radius: 50%; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                ${userName.charAt(0).toUpperCase()}
            </div>
            <p style="margin-bottom: 2rem; color: #666;">${userEmail}</p>
            
            <div class="dashboard-actions">
                <button onclick="handleLogout()" class="btn btn-secondary">Sign Out</button>
            </div>
        </div>
    `;
}

function renderLoggedOutView(container) {
    // Restore original login forms
    container.innerHTML = `
        <div class="header">
            <h1 class="header-title">Your Account</h1>
            <p class="header-subtitle">Login or create a new account to get started</p>
        </div>

        <div class="auth-tabs">
            <button class="auth-tab active" id="login-tab">Login</button>
            <button class="auth-tab" id="signup-tab">Create Account</button>
        </div>

        <!-- Login Form -->
        <div class="auth-form-container" id="login-form-container">
            <form class="profile-form" id="profile-login-form">
                <div class="form-group">
                    <label for="login-email">Email Address</label>
                    <input type="email" id="login-email" class="form-input" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required>
                </div>

                <div class="form-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="remember-me">
                        <span>Remember me</span>
                    </label>
                    <a href="#" class="forgot-password">Forgot Password?</a>
                </div>

                <button type="submit" class="btn btn-primary btn-full">Login</button>
            </form>
        </div>

        <!-- Create Account Form -->
        <div class="auth-form-container" id="signup-form-container" style="display: none;">
            <form class="profile-form" id="profile-signup-form">
                <div class="form-group">
                    <label for="signup-name">Full Name</label>
                    <input type="text" id="signup-name" class="form-input" placeholder="John Doe" required>
                </div>

                <div class="form-group">
                    <label for="signup-email">Email Address</label>
                    <input type="email" id="signup-email" class="form-input" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" class="form-input" placeholder="Create a strong password" required>
                </div>

                <div class="form-group">
                    <label for="signup-confirm">Confirm Password</label>
                    <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter your password" required>
                </div>

                <label class="checkbox-label">
                    <input type="checkbox" id="terms-agree" required>
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <button type="submit" class="btn btn-primary btn-full">Create Account</button>
            </form>
        </div>
    `;

    // Re-initialize listeners since we replaced DOM
    initializeProfileForms();
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert('Error logging out: ' + error.message);
    }
}

// Global scope to make it accessible to inline onclick
window.handleLogout = handleLogout;

function handleLogin() {
    // Deprecated in favor of event listeners
}

function handleCreateAccount() {
    // Deprecated in favor of event listeners
}

// ===================================
// SELL MENU
// ===================================
function initializeSellMenu() {
    const popButton = document.getElementById('popButton');

    if (popButton) {
        // Double-click to show sell menu
        popButton.addEventListener('dblclick', showSellMenu);

        // Right-click to show sell menu
        popButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showSellMenu();
        });
    }
}

function showSellMenu() {
    let sellModal = document.getElementById('sell-modal');

    if (!sellModal) {
        const modalHTML = `
            <div class="modal" id="sell-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Sell on CHASED</h2>
                        <button class="modal-close" id="close-sell-modal">&times;</button>
                    </div>
                    <div class="sell-options">
                        <p>Choose an option below to start selling:</p>
                        <button class="btn btn-primary"><i class="fas fa-plus-circle"></i> List New Item</button>
                        <button class="btn btn-secondary"><i class="fas fa-box"></i> My Listings</button>
                        <button class="btn btn-secondary"><i class="fas fa-chart-line"></i> Sales Dashboard</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        sellModal = document.getElementById('sell-modal');

        document.getElementById('close-sell-modal').addEventListener('click', () => {
            sellModal.classList.remove('active');
        });

        // Close on background click
        sellModal.addEventListener('click', (e) => {
            if (e.target === sellModal) {
                sellModal.classList.remove('active');
            }
        });
    }

    sellModal.classList.add('active');
}

// ===================================
// IMAGE VIEWER WITH ZOOM & ROTATION
// ===================================
function initializeImageViewer() {
    // Add click handlers to all product images
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openImageViewer(img);
        });
    });
}

function openImageViewer(imageElement) {
    // Get product information
    const productCard = imageElement.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const imageSrc = imageElement.src;

    // Reset zoom and rotation
    currentZoom = 1;
    currentRotation = 0;

    // Create or get viewer modal
    let viewerModal = document.getElementById('image-viewer-modal');

    if (!viewerModal) {
        const modalHTML = `
            <div class="modal image-viewer-modal" id="image-viewer-modal">
                <div class="image-viewer-content">
                    <div class="viewer-header">
                        <div class="viewer-product-info">
                            <h3 id="viewer-product-name">${productName}</h3>
                            <p id="viewer-product-price">${productPrice}</p>
                        </div>
                        <button class="modal-close" id="close-viewer-modal">&times;</button>
                    </div>
                    
                    <div class="viewer-image-container">
                        <img src="${imageSrc}" alt="${productName}" id="viewer-image" class="viewer-image">
                    </div>
                    
                    <div class="viewer-controls">
                        <div class="zoom-controls">
                            <button class="control-btn" id="zoom-out" title="Zoom Out">
                                <i class="fas fa-search-minus"></i>
                            </button>
                            <button class="control-btn" id="zoom-reset" title="Reset Zoom">
                                <i class="fas fa-compress"></i>
                            </button>
                            <button class="control-btn" id="zoom-in" title="Zoom In">
                                <i class="fas fa-search-plus"></i>
                            </button>
                        </div>
                        
                        <div class="rotation-controls">
                            <button class="control-btn" id="rotate-left" title="Rotate Left">
                                <i class="fas fa-undo"></i>
                            </button>
                            <button class="control-btn" id="rotate-360" title="360° View">
                                <i class="fas fa-sync"></i> 360°
                            </button>
                            <button class="control-btn" id="rotate-right" title="Rotate Right">
                                <i class="fas fa-redo"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        viewerModal = document.getElementById('image-viewer-modal');

        // Setup event listeners
        setupImageViewerControls();
    } else {
        // Update existing modal with new image
        document.getElementById('viewer-product-name').textContent = productName;
        document.getElementById('viewer-product-price').textContent = productPrice;
        document.getElementById('viewer-image').src = imageSrc;
        document.getElementById('viewer-image').alt = productName;
    }

    // Show modal
    viewerModal.classList.add('active');

    // Change background to light cyan
    document.body.classList.add('image-viewer-active');

    // Reset image transform
    updateImageTransform();
}

function setupImageViewerControls() {
    const viewerModal = document.getElementById('image-viewer-modal');
    const viewerImage = document.getElementById('viewer-image');

    // Close button
    document.getElementById('close-viewer-modal').addEventListener('click', () => {
        viewerModal.classList.remove('active');
        document.body.classList.remove('image-viewer-active');
    });

    // Close on background click
    viewerModal.addEventListener('click', (e) => {
        if (e.target === viewerModal) {
            viewerModal.classList.remove('active');
            document.body.classList.remove('image-viewer-active');
        }
    });

    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.25, 3);
        updateImageTransform();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.25, 0.5);
        updateImageTransform();
    });

    document.getElementById('zoom-reset').addEventListener('click', () => {
        currentZoom = 1;
        currentRotation = 0;
        updateImageTransform();
    });

    // Rotation controls
    document.getElementById('rotate-left').addEventListener('click', () => {
        currentRotation -= 90;
        updateImageTransform();
    });

    document.getElementById('rotate-right').addEventListener('click', () => {
        currentRotation += 90;
        updateImageTransform();
    });

    document.getElementById('rotate-360').addEventListener('click', () => {
        animate360Rotation();
    });

    // Mouse wheel zoom (optional enhancement)
    viewerImage.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            currentZoom = Math.min(currentZoom + 0.1, 3);
        } else {
            currentZoom = Math.max(currentZoom - 0.1, 0.5);
        }
        updateImageTransform();
    });
}

function updateImageTransform() {
    const viewerImage = document.getElementById('viewer-image');
    viewerImage.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
}

function animate360Rotation() {
    const viewerImage = document.getElementById('viewer-image');
    let rotationStep = 0;
    const totalSteps = 36; // 10 degree increments
    const interval = 30; // milliseconds

    const rotationInterval = setInterval(() => {
        rotationStep++;
        currentRotation = (rotationStep * 10) % 360;
        updateImageTransform();

        if (rotationStep >= totalSteps) {
            clearInterval(rotationInterval);
            currentRotation = 0;
            updateImageTransform();
        }
    }, interval);
}

// ===================================
// SECTION NAVIGATION (Home, Buy, Sell, Profile)
// ===================================
function initializeNavigation() {
    // Add click handlers to navigation links with data-section attribute
    const navLinks = document.querySelectorAll('.nav-link[data-section], .mobile-nav-link[data-section], .mobile-nav-icon[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.getAttribute('data-section');
            navigateToSection(sectionName);
        });
    });
}

// Global function to navigate between sections
function navigateToSection(sectionName) {
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    }

    // Update active state in navigation
    const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make navigateToSection globally accessible
window.navigateToSection = navigateToSection;

// ===================================
// HEADER MINI-INTERACTIONS (Help, Contact)
// ===================================
function initializeHeaderInteractions() {
    const helpLinks = [document.getElementById('help-link'), document.getElementById('mobile-help-link')];
    const contactLinks = [document.getElementById('contact-link'), document.getElementById('mobile-contact-link')];
    const helpModal = document.getElementById('help-modal');
    const contactModal = document.getElementById('contact-modal');
    const closeHelp = document.getElementById('close-help');
    const closeContact = document.getElementById('close-contact');

    // Help Links
    helpLinks.forEach(link => {
        if (link && helpModal) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                helpModal.classList.add('active');
            });
        }
    });

    // Contact Links
    contactLinks.forEach(link => {
        if (link && contactModal) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.classList.add('active');
            });
        }
    });

    [closeHelp, closeContact].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) modal.classList.remove('active');
            });
        }
    });

    // Close modals on outside click
    [helpModal, contactModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });
}
// Handle contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message. CHASED support will contact you shortly.');
            btn.textContent = originalText;
            btn.disabled = false;
            contactForm.reset();
            contactModal.classList.remove('active');
        }, 1000);
    });
}

// ===================================
// HEADER SEARCH TOGGLE
// ===================================
function initializeHeaderSearch() {
    // Desktop Search
    const searchContainer = document.getElementById('header-search');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');

    // Mobile Search
    const mobileSearchContainer = document.getElementById('mobile-header-search');
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchClose = document.getElementById('mobile-search-close');

    function handleSearchEnter(e, input, container) {
        if (e.key === 'Enter') {
            const query = input.value.toLowerCase().trim();
            let categoryToSelect = '';

            const keywords = {
                pants: ['pants', 'trousers', 'jeans', 'leggings', 'bottoms', 'slacks'],
                jewelry: ['jewelry', 'jewelary', 'accessory', 'necklace', 'ring', 'earring', 'bracelet', 'gem', 'gold', 'silver'],
                tops: ['tops', 'top', 'shirt', 'blouse', 'sweater', 'tshirt', 'tee', 'hoodie', 'jacket', 'coat'],
                dresses: ['dresses', 'dress', 'gown', 'skirt', 'maxi', 'mini', 'midi'],
                footwear: ['footwear', 'shoes', 'shoe', 'boots', 'sneakers', 'heels', 'sandals', 'flats']
            };

            for (const [category, synonyms] of Object.entries(keywords)) {
                if (synonyms.some(syn => query.includes(syn))) {
                    categoryToSelect = category;
                    break;
                }
            }

            if (categoryToSelect) {
                navigateToSection('buy');
                const tab = document.querySelector(`.category-tab[data-category="${categoryToSelect}"]`);
                if (tab) tab.click();
                input.value = '';
                container.classList.remove('expanded');
            }
        }
    }

    // Desktop Event Listeners
    if (searchToggle && searchContainer && searchInput) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchContainer.classList.toggle('expanded');
            if (searchContainer.classList.contains('expanded')) searchInput.focus();
        });

        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) searchContainer.classList.remove('expanded');
        });

        searchInput.addEventListener('click', (e) => e.stopPropagation());
        searchInput.addEventListener('keydown', (e) => handleSearchEnter(e, searchInput, searchContainer));
    }

    // Mobile Event Listeners
    if (mobileSearchToggle && mobileSearchContainer && mobileSearchInput) {
        mobileSearchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileSearchContainer.classList.add('expanded');
            mobileSearchInput.focus();
        });

        if (mobileSearchClose) {
            mobileSearchClose.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileSearchContainer.classList.remove('expanded');
            });
        }

        mobileSearchInput.addEventListener('click', (e) => e.stopPropagation());
        mobileSearchInput.addEventListener('keydown', (e) => handleSearchEnter(e, mobileSearchInput, mobileSearchContainer));

        // Re-use desktop click behavior to close mobile search if needed, 
        // but mobile search has a dedicated close button too.
        document.addEventListener('click', (e) => {
            if (!mobileSearchContainer.contains(e.target)) {
                mobileSearchContainer.classList.remove('expanded');
            }
        });
    }
}

// ===================================
// PROFILE FORMS (Login/Create Account)
// ===================================
function initializeProfileForms() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');

    if (loginTab && signupTab && loginForm && signupForm) {
        // Tab switching
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        });

        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }

    // Handle login form submission
    const loginFormElement = document.getElementById('profile-login-form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const btn = loginFormElement.querySelector('button');

            const originalText = btn.innerHTML;
            btn.innerHTML = 'Logging in...';
            btn.disabled = true;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            btn.innerHTML = originalText;
            btn.disabled = false;

            if (error) {
                alert('Login failed: ' + error.message);
            } else {
                // Success is handled by onAuthStateChange
            }
        });
    }

    // Handle signup form submission
    const signupFormElement = document.getElementById('profile-signup-form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }

            const btn = signupFormElement.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Creating Account...';
            btn.disabled = true;

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            btn.innerHTML = originalText;
            btn.disabled = false;

            if (error) {
                alert('Signup failed: ' + error.message);
            } else {
                alert('Account created! Please check your email for confirmation if required, or login now.');
                // Depending on generic Supabase config, email confirmation might be off.
                // If auto-confirm is on, onAuthStateChange will trigger.
            }
        });
    }
}

// ===================================
// PRODUCT CATEGORIES (Dresses, Footwear, Tops, Pants)
// ===================================
function initializeProductCategories() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const placeholder = document.getElementById('category-placeholder');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const categoryName = tab.getAttribute('data-category');

            // Hide placeholder
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show selected category content
            const allCategories = document.querySelectorAll('.category-content');
            allCategories.forEach(cat => {
                cat.style.display = 'none';
                cat.classList.remove('active');
            });

            const selectedCategory = document.getElementById(`${categoryName}-category`);
            if (selectedCategory) {
                selectedCategory.style.display = 'block';
                selectedCategory.classList.add('active');
            }
        });
    });
}
