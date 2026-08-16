// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

const STORAGE_KEYS = {
    POLICIES: 'insurancePolicies',
    REVIEWS: 'clientReviews'
};

// Default policies
const DEFAULT_POLICIES = [
    {
        id: 1,
        name: 'Comprehensive Health Insurance',
        type: 'Health',
        description: 'Complete family health coverage with cashless hospitalization',
        benefits: ['Cashless hospitalization at 5000+ hospitals', 'Annual health checkup', 'Mental health coverage', 'COVID-19 protection'],
        coverage: '₹5 Lakh - ₹25 Lakh',
        premium: '₹2,500/year - ₹8,000/year'
    },
    {
        id: 2,
        name: 'Third Party Auto Insurance',
        type: 'Auto',
        description: 'Mandatory third-party liability coverage for all vehicles',
        benefits: ['Third-party liability coverage', 'Legal assistance', '24/7 roadside assistance', 'Fast claim settlement'],
        coverage: 'As per law',
        premium: '₹500/year - ₹2,000/year'
    },
    {
        id: 3,
        name: 'Comprehensive Home Insurance',
        type: 'Home',
        description: 'Protection for your property and personal belongings',
        benefits: ['Fire and natural disaster coverage', 'Theft protection', 'Temporary accommodation', 'Personal liability'],
        coverage: '₹10 Lakh - ₹1 Crore',
        premium: '₹3,000/year - ₹15,000/year'
    }
];

// Default reviews
const DEFAULT_REVIEWS = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        profession: 'Business Owner',
        rating: 5,
        text: 'Excellent service! Neeraj helped me choose the perfect business insurance plan. Highly recommended!'
    },
    {
        id: 2,
        name: 'Priya Sharma',
        profession: 'Software Engineer',
        rating: 5,
        text: 'Best insurance advisor I have worked with. Very knowledgeable and patient. Great experience!'
    },
    {
        id: 3,
        name: 'Amit Patel',
        profession: 'Doctor',
        rating: 4,
        text: 'Professional advice with good insurance options. Would definitely recommend to friends and family.'
    }
];

// Initialize storage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.POLICIES)) {
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(DEFAULT_POLICIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    }
}

// Get all policies
function getPolicies() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICIES) || '[]');
}

// Save policies
function savePolicies(policies) {
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
}

// Get all reviews
function getReviews() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
}

// Save reviews
function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
}

// ============================================
// POLICIES MANAGEMENT
// ============================================

let editingPolicyId = null;

const policyModal = document.getElementById('policyModal');
const addPolicyBtn = document.getElementById('addPolicyBtn');
const closePolicyModal = document.getElementById('closePolicyModal');
const policyForm = document.getElementById('policyForm');
const cancelPolicyBtn = document.getElementById('cancelPolicyBtn');
const policiesContainer = document.getElementById('policiesContainer');
const policyModalTitle = document.getElementById('policyModalTitle');

// Open add policy modal
addPolicyBtn.addEventListener('click', () => {
    editingPolicyId = null;
    policyForm.reset();
    policyModalTitle.textContent = 'Add New Policy';
    policyModal.style.display = 'block';
});

// Close policy modal
closePolicyModal.addEventListener('click', () => {
    policyModal.style.display = 'none';
});

cancelPolicyBtn.addEventListener('click', () => {
    policyModal.style.display = 'none';
});

// Handle policy form submission
policyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        id: editingPolicyId || Date.now(),
        name: document.getElementById('policyName').value,
        type: document.getElementById('policyType').value,
        description: document.getElementById('policyDescription').value,
        benefits: document.getElementById('policyBenefits').value.split(',').map(b => b.trim()).filter(b => b),
        coverage: document.getElementById('policyCoverage').value,
        premium: document.getElementById('policyPremium').value
    };

    let policies = getPolicies();

    if (editingPolicyId) {
        policies = policies.map(p => p.id === editingPolicyId ? formData : p);
    } else {
        policies.push(formData);
    }

    savePolicies(policies);
    policyModal.style.display = 'none';
    policyForm.reset();
    renderPolicies();
    showNotification('Policy saved successfully!');
});

// Render policies
function renderPolicies() {
    const policies = getPolicies();
    policiesContainer.innerHTML = '';

    policies.forEach(policy => {
        const policyCard = document.createElement('div');
        policyCard.className = 'policy-card';
        policyCard.innerHTML = `
            <div class="policy-card-header">
                <span class="policy-type">${policy.type}</span>
                <div class="policy-actions">
                    <button title="Edit" onclick="editPolicy(${policy.id})"><i class="fas fa-edit"></i></button>
                    <button title="Delete" onclick="deletePolicy(${policy.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <h3>${policy.name}</h3>
            <p>${policy.description}</p>
            ${policy.benefits.length > 0 ? `
                <div class="policy-benefits">
                    <h4>Key Benefits</h4>
                    <ul>
                        ${policy.benefits.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="policy-details">
                ${policy.coverage ? `<div><strong>Coverage</strong>${policy.coverage}</div>` : ''}
                ${policy.premium ? `<div><strong>Premium</strong>${policy.premium}</div>` : ''}
            </div>
        `;
        policiesContainer.appendChild(policyCard);
    });
}

// Edit policy
function editPolicy(id) {
    const policies = getPolicies();
    const policy = policies.find(p => p.id === id);
    
    if (policy) {
        editingPolicyId = id;
        document.getElementById('policyName').value = policy.name;
        document.getElementById('policyType').value = policy.type;
        document.getElementById('policyDescription').value = policy.description;
        document.getElementById('policyBenefits').value = policy.benefits.join(', ');
        document.getElementById('policyCoverage').value = policy.coverage;
        document.getElementById('policyPremium').value = policy.premium;
        
        policyModalTitle.textContent = 'Edit Policy';
        policyModal.style.display = 'block';
    }
}

// Delete policy
function deletePolicy(id) {
    if (confirm('Are you sure you want to delete this policy?')) {
        let policies = getPolicies();
        policies = policies.filter(p => p.id !== id);
        savePolicies(policies);
        renderPolicies();
        showNotification('Policy deleted successfully!');
    }
}

// ============================================
// REVIEWS MANAGEMENT
// ============================================

let editingReviewId = null;
let currentRating = 0;

const reviewModal = document.getElementById('reviewModal');
const addReviewBtn = document.getElementById('addReviewBtn');
const closeReviewModal = document.getElementById('closeReviewModal');
const reviewForm = document.getElementById('reviewForm');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const reviewsContainer = document.getElementById('reviewsContainer');
const reviewModalTitle = document.getElementById('reviewModalTitle');
const starRating = document.getElementById('starRating');
const reviewRatingInput = document.getElementById('reviewRating');

// Star rating system
const stars = starRating.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = star.dataset.value;
        reviewRatingInput.value = currentRating;
        stars.forEach(s => {
            if (s.dataset.value <= currentRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

// Open add review modal
addReviewBtn.addEventListener('click', () => {
    editingReviewId = null;
    reviewForm.reset();
    currentRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    reviewModalTitle.textContent = 'Add Client Review';
    reviewModal.style.display = 'block';
});

// Close review modal
closeReviewModal.addEventListener('click', () => {
    reviewModal.style.display = 'none';
});

cancelReviewBtn.addEventListener('click', () => {
    reviewModal.style.display = 'none';
});

// Handle review form submission
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentRating) {
        alert('Please select a rating');
        return;
    }
    
    const formData = {
        id: editingReviewId || Date.now(),
        name: document.getElementById('reviewName').value,
        profession: document.getElementById('reviewProfession').value,
        rating: parseInt(currentRating),
        text: document.getElementById('reviewText').value
    };

    let reviews = getReviews();

    if (editingReviewId) {
        reviews = reviews.map(r => r.id === editingReviewId ? formData : r);
    } else {
        reviews.push(formData);
    }

    saveReviews(reviews);
    reviewModal.style.display = 'none';
    reviewForm.reset();
    currentRating = 0;
    renderReviews();
    showNotification('Review posted successfully!');
});

// Render reviews
function renderReviews() {
    const reviews = getReviews();
    reviewsContainer.innerHTML = '';

    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<span class="star" style="color: ${i < review.rating ? '#ffc107' : '#ddd'}">★</span>`;
        }
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-author">
                    <h4>${review.name}</h4>
                    ${review.profession ? `<p>${review.profession}</p>` : ''}
                </div>
                <div class="review-actions">
                    <button title="Edit" onclick="editReview(${review.id})"><i class="fas fa-edit"></i></button>
                    <button title="Delete" onclick="deleteReview(${review.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="review-rating">
                ${stars}
            </div>
            <p class="review-text">"${review.text}"</p>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

// Edit review
function editReview(id) {
    const reviews = getReviews();
    const review = reviews.find(r => r.id === id);
    
    if (review) {
        editingReviewId = id;
        document.getElementById('reviewName').value = review.name;
        document.getElementById('reviewProfession').value = review.profession || '';
        document.getElementById('reviewText').value = review.text;
        
        currentRating = review.rating;
        reviewRatingInput.value = currentRating;
        stars.forEach(s => {
            if (s.dataset.value <= currentRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        
        reviewModalTitle.textContent = 'Edit Review';
        reviewModal.style.display = 'block';
    }
}

// Delete review
function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        let reviews = getReviews();
        reviews = reviews.filter(r => r.id !== id);
        saveReviews(reviews);
        renderReviews();
        showNotification('Review deleted successfully!');
    }
}

// ============================================
// CONSULTATION REQUEST
// ============================================

const consultationModal = document.getElementById('consultationModal');
const consultBtn = document.getElementById('consultBtn');
const closeConsultationModal = document.getElementById('closeConsultationModal');
const consultationForm = document.getElementById('consultationForm');
const cancelConsultBtn = document.getElementById('cancelConsultBtn');

consultBtn.addEventListener('click', () => {
    consultationModal.style.display = 'block';
});

closeConsultationModal.addEventListener('click', () => {
    consultationModal.style.display = 'none';
});

cancelConsultBtn.addEventListener('click', () => {
    consultationModal.style.display = 'none';
});

consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const consultationData = {
        name: document.getElementById('consultName').value,
        email: document.getElementById('consultEmail').value,
        phone: document.getElementById('consultPhone').value,
        type: document.getElementById('consultType').value,
        message: document.getElementById('consultMessage').value,
        date: new Date().toLocaleString()
    };

    console.log('Consultation Request:', consultationData);
    showNotification('Consultation request received! We will contact you soon.');
    consultationForm.reset();
    consultationModal.style.display = 'none';
});

// ============================================
// MOBILE NAVIGATION
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// MODAL CLOSE ON OUTSIDE CLICK
// ============================================

window.addEventListener('click', (e) => {
    if (e.target === policyModal) {
        policyModal.style.display = 'none';
    }
    if (e.target === reviewModal) {
        reviewModal.style.display = 'none';
    }
    if (e.target === consultationModal) {
        consultationModal.style.display = 'none';
    }
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff 0%, #0066cc 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE APP
// ============================================

initializeStorage();
renderPolicies();
renderReviews();