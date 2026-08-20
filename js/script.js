/**
 * PERSONAL LOAN PLATFORM - REDESIGNED JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDashboardSidebar();
  initFaq();
  initTestimonialSlider();
  initEmiCalculators();
  initCombinedWizard();
  initDashboards();
  initContactForm();
  initScrollAnimations();
  initRealTimeInputValidation();
});

/* ==========================================================================
   1. NAVBAR, NAVIGATION & RESPONSIVE MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (!header) return;

  // Scroll transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle drawer open
  if (hamburger && navMenu && drawerOverlay) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      drawerOverlay.classList.toggle('active');
      if (navMenu.classList.contains('active')) {
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
      } else {
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }
    });

    // Close drawer handlers
    const closeDrawer = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    };

    if (drawerClose) {
      drawerClose.addEventListener('click', closeDrawer);
    }

    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Active Link Highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initDashboardSidebar() {
  const menuToggle = document.getElementById('dbMobileMenuToggle');
  const sidebar = document.querySelector('.db-sidebar');
  const overlay = document.getElementById('dbSidebarOverlay');
  const closeBtn = document.getElementById('dbSidebarClose');

  if (menuToggle && sidebar && overlay) {
    const closeSidebar = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
      if (sidebar.classList.contains('open')) {
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
      } else {
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    overlay.addEventListener('click', closeSidebar);

    const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }
}

/* ==========================================================================
   2. FAQ ACCORDION
   ========================================================================== */
function initFaq() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const body = i.querySelector('.faq-body');
        if (body) body.style.maxHeight = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      }
    });
  });
}

/* ==========================================================================
   3. TESTIMONIAL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-controls');

  if (!slider || slides.length === 0) return;

  let currentIdx = 0;
  let autoPlayTimer;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(idx) {
    currentIdx = idx;
    slider.style.transform = `translateX(-${currentIdx * 100}%)`;
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === currentIdx);
    });
  }

  function nextSlide() {
    let next = currentIdx + 1;
    if (next >= slides.length) next = 0;
    goToSlide(next);
  }

  function resetTimer() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 5000);
  }

  resetTimer();
}

/* ==========================================================================
   4. EMI CALCULATOR
   ========================================================================== */
function calculateEMI(amount, rateYearly, tenureMonths) {
  const r = rateYearly / 12 / 100;
  const n = tenureMonths;
  if (r === 0) return { emi: amount / n, totalInterest: 0, totalRepayment: amount };

  const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - amount;

  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100
  };
}

function updateDonutChart(principal, interest) {
  const path = document.querySelector('.donut-circle-path');
  const percentText = document.querySelector('.chart-center-percent');
  if (!path) return;

  const total = principal + interest;
  const interestPercent = total > 0 ? (interest / total) * 100 : 0;
  const circumference = 314.159;
  const strokeDashoffset = circumference - (interestPercent / 100) * circumference;

  path.style.strokeDasharray = `${circumference} ${circumference}`;
  path.style.strokeDashoffset = strokeDashoffset;
  
  if (percentText) {
    percentText.textContent = `${Math.round(interestPercent)}% Interest`;
  }
}

function initEmiCalculators() {
  const loanAmtSlider = document.getElementById('emiLoanAmt');
  const loanAmtVal = document.getElementById('emiLoanAmtVal');
  const interestSlider = document.getElementById('emiInterest');
  const interestVal = document.getElementById('emiInterestVal');
  const tenureSlider = document.getElementById('emiTenure');
  const tenureVal = document.getElementById('emiTenureVal');

  const emiDisplay = document.getElementById('calculatedEmi');
  const totalInterestDisplay = document.getElementById('calculatedInterest');
  const totalRepayDisplay = document.getElementById('calculatedRepay');

  if (!loanAmtSlider) return;

  function runEmiCalc() {
    const amt = parseFloat(loanAmtSlider.value);
    const rate = parseFloat(interestSlider.value);
    const tenure = parseInt(tenureSlider.value);

    if (loanAmtVal) loanAmtVal.textContent = `$${amt.toLocaleString()}`;
    if (interestVal) interestVal.textContent = `${rate}%`;
    if (tenureVal) tenureVal.textContent = `${tenure} Months`;

    const result = calculateEMI(amt, rate, tenure);

    if (emiDisplay) emiDisplay.textContent = `$${result.emi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (totalInterestDisplay) totalInterestDisplay.textContent = `$${result.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (totalRepayDisplay) totalRepayDisplay.textContent = `$${result.totalRepayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    updateDonutChart(amt, result.totalInterest);
  }

  loanAmtSlider.addEventListener('input', runEmiCalc);
  interestSlider.addEventListener('input', runEmiCalc);
  tenureSlider.addEventListener('input', runEmiCalc);

  const resetBtn = document.getElementById('resetEmiCalc');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      loanAmtSlider.value = 10000;
      interestSlider.value = 10.5;
      tenureSlider.value = 24;
      runEmiCalc();
    });
  }

  runEmiCalc();
}

/* ==========================================================================
   5. COMBINED ELIGIBILITY & APPLICATION WIZARD (apply.html)
   ========================================================================== */
function initCombinedWizard() {
  const wizard = document.getElementById('combinedLoanForm');
  if (!wizard) return;

  const sections = wizard.querySelectorAll('.wizard-section');
  const stepNodes = wizard.querySelectorAll('.wizard-step');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  let currentStep = 0;

  function showStep(stepIdx) {
    sections.forEach((sec, idx) => {
      sec.classList.toggle('active', idx === stepIdx);
    });

    stepNodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === stepIdx);
      node.classList.toggle('completed', idx < stepIdx);
    });

    currentStep = stepIdx;

    if (currentStep === 0) {
      btnPrev.style.visibility = 'hidden';
    } else {
      btnPrev.style.visibility = 'visible';
    }

    if (currentStep === sections.length - 1) {
      btnNext.textContent = 'Submit Application';
    } else {
      btnNext.textContent = 'Continue';
    }

    if (currentStep === sections.length - 1) {
      populateSummaryReview();
    }
  }

  function runEligibilityAssessor() {
    const age = parseInt(document.getElementById('appAge').value);
    const income = parseFloat(document.getElementById('appIncome').value);
    const amount = parseFloat(document.getElementById('requestedAmount').value);
    const empType = document.getElementById('appEmpType').value;
    const feedbackBanner = document.getElementById('eligibilityFeedbackBanner');

    if (!feedbackBanner) return;

    let score = 0;
    if (age >= 21 && age <= 65) score += 20;
    if (income >= 2500) score += 30;
    else if (income >= 1500) score += 15;

    if (empType === 'salaried') score += 20;
    else if (empType === 'self-employed') score += 15;

    const estimatedEMI = calculateEMI(amount, 11.5, 36).emi;
    const dti = (estimatedEMI / income) * 100;
    if (dti < 35) score += 30;
    else if (dti < 50) score += 15;

    feedbackBanner.style.display = 'block';
    if (score >= 75) {
      feedbackBanner.className = 'eligibility-banner banner-approved';
      feedbackBanner.innerHTML = `<strong>Status: High Suitability Probablity.</strong> Your monthly income ($${income.toLocaleString()}) and DTI ratio (${Math.round(dti)}%) look strong. Proceed to complete your personal detail checks.`;
    } else if (score >= 50) {
      feedbackBanner.className = 'eligibility-banner banner-pending';
      feedbackBanner.innerHTML = `<strong>Status: Moderate Suitability.</strong> Your profile meets our core lending criteria. Proceed to input details. Manual underwriting may request documents.`;
    } else {
      feedbackBanner.className = 'eligibility-banner banner-rejected';
      feedbackBanner.innerHTML = `<strong>Status: Review Required.</strong> Income thresholds or age limits are outside standard pre-approval brackets. You may still complete the application for manual credit reviews.`;
    }
  }

  function populateSummaryReview() {
    const summaryDiv = document.getElementById('summaryReviewContent');
    if (!summaryDiv) return;

    const data = {
      name: document.getElementById('appFullName').value,
      age: document.getElementById('appAge').value,
      email: document.getElementById('appEmail').value,
      mobile: document.getElementById('appPhone').value,
      address: document.getElementById('appAddress').value,
      empType: document.getElementById('appEmpType').value,
      company: document.getElementById('appCompany').value || 'N/A',
      income: document.getElementById('appIncome').value,
      experience: document.getElementById('appExperience').value || '0',
      loanType: document.getElementById('loanType').value,
      loanAmt: document.getElementById('requestedAmount').value,
      tenure: document.getElementById('preferredTenure').value,
      purpose: document.getElementById('loanPurpose').value
    };

    summaryDiv.innerHTML = `
      <div class="summary-review-block" style="background:#F8F9FA; padding:1.5rem; border-radius:10px; margin-bottom:1.5rem; border:1px solid var(--border-color);">
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem; font-weight:600; color:var(--accent-blue);">Personal & Eligibility Parameters</div>
        <div class="form-grid" style="font-size:0.85rem; gap:0.5rem 1.5rem; margin-bottom:1rem;">
          <div>Name: <strong>${data.name}</strong></div>
          <div>Age: <strong>${data.age} Yrs</strong></div>
          <div>Email: <strong>${data.email}</strong></div>
          <div>Mobile: <strong>${data.mobile}</strong></div>
          <div style="grid-column: span 2;">Address: <strong>${data.address}</strong></div>
        </div>
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem; font-weight:600; color:var(--accent-blue);">Employment & Income Details</div>
        <div class="form-grid" style="font-size:0.85rem; gap:0.5rem 1.5rem; margin-bottom:1rem;">
          <div>Type: <strong>${data.empType}</strong></div>
          <div>Company: <strong>${data.company}</strong></div>
          <div>Monthly Income: <strong>$${parseFloat(data.income).toLocaleString()}</strong></div>
          <div>Experience: <strong>${data.experience} Yrs</strong></div>
        </div>
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem; font-weight:600; color:var(--accent-blue);">Loan Program Specs</div>
        <div class="form-grid" style="font-size:0.85rem; gap:0.5rem 1.5rem;">
          <div>Loan: <strong>${data.loanType}</strong></div>
          <div>Amount: <strong>$${parseFloat(data.loanAmt).toLocaleString()}</strong></div>
          <div>Tenure: <strong>${data.tenure} Months</strong></div>
          <div style="grid-column: span 2;">Purpose: <strong>${data.purpose}</strong></div>
        </div>
      </div>
    `;
  }

  btnNext.addEventListener('click', () => {
    const currentSection = sections[currentStep];
    if (!validateForm(currentSection)) return;

    if (currentStep === 0) {
      runEligibilityAssessor();
      showStep(1);
    } else if (currentStep < sections.length - 1) {
      showStep(currentStep + 1);
    } else {
      const consent = document.getElementById('agreeTerms');
      if (consent && !consent.checked) {
        alert('You must consent to terms and parameters check.');
        return;
      }

      const refNum = 'LN-' + Math.floor(Math.random() * 900000 + 100000);
      const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      const newApp = {
        ref: refNum,
        name: document.getElementById('appFullName').value,
        email: document.getElementById('appEmail').value,
        mobile: document.getElementById('appPhone').value,
        loanType: document.getElementById('loanType').value,
        amount: parseFloat(document.getElementById('requestedAmount').value),
        tenure: parseInt(document.getElementById('preferredTenure').value),
        income: parseFloat(document.getElementById('appIncome').value),
        status: 'Submitted',
        date: new Date().toLocaleDateString(),
        stage: 1
      };
      apps.unshift(newApp);
      localStorage.setItem('loanApplications', JSON.stringify(apps));

      localStorage.setItem('currentUser', JSON.stringify({ role: 'user', email: newApp.email, name: newApp.name }));

      alert(`Application Successfully Submitted!\nReference ID: ${refNum}\nYour application is registered. We will email you status updates shortly.`);
      window.location.href = 'index.html';
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  showStep(0);
}

/* ==========================================================================
   6. PORTAL DASHBOARDS (USER & ADMIN)
   ========================================================================== */
function initDashboards() {
  const userDash = document.getElementById('userDashboardWrapper');
  const adminDash = document.getElementById('adminDashboardWrapper');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  document.querySelectorAll('.action-logout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  });

  if (localStorage.getItem('loanApplications') === null) {
    const defaultApps = [
      { ref: 'LN-604812', name: 'Demo User', email: 'user@loan.com', mobile: '5552345678', loanType: 'Personal Loan', amount: 12000, tenure: 24, income: 4000, status: 'Approved', date: '08/11/2026', stage: 4 },
      { ref: 'LN-483921', name: 'Marcus Vance', email: 'marcus@mail.com', mobile: '5551234567', loanType: 'Debt Consolidation', amount: 25000, tenure: 48, income: 5500, status: 'Under Review', date: '08/15/2026', stage: 2 }
    ];
    localStorage.setItem('loanApplications', JSON.stringify(defaultApps));
  }

  if (localStorage.getItem('contactMessages') === null) {
    const defaultMsgs = [
      { id: 'MSG-4820', name: 'Sarah Jenkins', email: 'sarah@domain.com', mobile: '5558889999', subject: 'Rate Adjustments', message: 'Hello, can I refinance my active education loan next year?', date: '08/16/2026' }
    ];
    localStorage.setItem('contactMessages', JSON.stringify(defaultMsgs));
  }

  if (userDash) {
    if (!currentUser || currentUser.role !== 'user') {
      localStorage.setItem('currentUser', JSON.stringify({ role: 'user', email: 'user@loan.com', name: 'Demo User' }));
      location.reload();
      return;
    }
    loadUserDashboard(currentUser);
  }

  if (adminDash) {
    if (!currentUser || currentUser.role !== 'admin') {
      const pass = prompt('Enter Admin Password (admin123):');
      if (pass === 'admin123') {
        localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', email: 'admin@loan.com' }));
      } else {
        alert('Unauthorized. Redirecting to home.');
        window.location.href = 'index.html';
        return;
      }
    }
    loadAdminDashboard();
  }
}

function loadUserDashboard(user) {
  const nameLabel = document.getElementById('dbUserName');
  if (nameLabel) nameLabel.textContent = user.name;

  const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
  let userApp = apps.find(a => a.email === user.email);
  if (!userApp && apps.length > 0) userApp = apps[0];

  if (!userApp) return;

  const requestedAmt = document.getElementById('userReqAmt');
  const approvedAmt = document.getElementById('userApprovedAmt');
  const outstandingBal = document.getElementById('userOutstandingAmt');
  const nextEmi = document.getElementById('userNextEmi');
  const appStatus = document.getElementById('userAppStatus');

  if (requestedAmt) requestedAmt.textContent = `$${userApp.amount.toLocaleString()}`;
  if (approvedAmt) {
    approvedAmt.textContent = userApp.status === 'Approved' || userApp.status === 'Completed' 
      ? `$${userApp.amount.toLocaleString()}` 
      : '$0';
  }
  if (outstandingBal) {
    outstandingBal.textContent = userApp.status === 'Approved' ? `$${(userApp.amount * 1.04).toLocaleString()}` : '$0';
  }
  if (nextEmi) {
    if (userApp.status === 'Approved') {
      const emi = calculateEMI(userApp.amount, 9.9, userApp.tenure).emi;
      nextEmi.textContent = `$${emi.toLocaleString()}`;
    } else {
      nextEmi.textContent = '--';
    }
  }
  if (appStatus) {
    appStatus.textContent = userApp.status;
    appStatus.className = `badge ${userApp.status === 'Approved' ? 'badge-approved' : userApp.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`;
  }

  loadTrackingStepper(userApp);

  const userMsgInput = document.getElementById('userSupportMessageInput');
  const userMsgSend = document.getElementById('userSupportMessageSend');
  const chatHistory = document.querySelector('.chat-history');

  if (userMsgInput && userMsgSend && chatHistory) {
    function sendMsg() {
      const txt = userMsgInput.value.trim();
      if (!txt) return;

      const bubble = document.createElement('div');
      bubble.className = 'chat-msg sent';
      bubble.textContent = txt;
      chatHistory.appendChild(bubble);
      userMsgInput.value = '';
      chatHistory.scrollTop = chatHistory.scrollHeight;

      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'chat-msg received';
        reply.textContent = 'Thanks! Our underwriting support desk will update your status notifications.';
        chatHistory.appendChild(reply);
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }, 1500);
    }
    userMsgSend.addEventListener('click', sendMsg);
    userMsgInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMsg();
    });
  }

  const uploadArea = document.querySelector('.upload-area');
  const docInput = document.getElementById('docFileInput');
  if (uploadArea && docInput) {
    uploadArea.addEventListener('click', () => docInput.click());
    docInput.addEventListener('change', () => {
      if (docInput.files.length > 0) {
        alert(`Document: "${docInput.files[0].name}" has been securely uploaded for underwriter verification.`);
      }
    });
  }
}

function loadTrackingStepper(app) {
  const trackerVisual = document.getElementById('trackingResultVisual');
  if (!trackerVisual) return;

  const stages = [
    { label: 'Application Submitted', desc: 'Financial record registered inside Apex database.' },
    { label: 'Under Review', desc: 'Credit assessment scoring is checking risk thresholds.' },
    { label: 'Verification', desc: 'Underwriters review uploaded payslips and identity cards.' },
    { label: 'Decision Made', desc: 'Final terms calculated and APR rates finalized.' },
    { label: 'Funds Disbursed', desc: 'Credit amount processed for transfer to bank account.' }
  ];

  let activeIdx = 0;
  if (app.status === 'Submitted') activeIdx = 0;
  else if (app.status === 'Under Review') activeIdx = 1;
  else if (app.status === 'Verification') activeIdx = 2;
  else if (app.status === 'Approved' || app.status === 'Rejected') activeIdx = 3;
  else if (app.status === 'Completed') activeIdx = 4;

  let stepperHtml = '';
  stages.forEach((stage, idx) => {
    let nodeClass = '';
    let icon = '✓';

    if (idx === activeIdx) {
      nodeClass = 'active';
      icon = '⏳';
      if (idx === 3 && app.status === 'Rejected') icon = '✗';
    } else if (idx < activeIdx) {
      nodeClass = 'completed';
    }

    let customDesc = stage.desc;
    if (idx === 3) {
      if (app.status === 'Approved') customDesc = 'Congratulations! Your loan program has been approved.';
      else if (app.status === 'Rejected') customDesc = 'Lending criteria review did not clear thresholds this term.';
    }

    stepperHtml += `
      <div class="tracker-node ${nodeClass}">
        <div class="tracker-icon">${icon}</div>
        <div class="tracker-info">
          <h3>${stage.label}</h3>
          <p>${customDesc}</p>
        </div>
      </div>
    `;
  });

  trackerVisual.innerHTML = `
    <div class="tracker-card">
      <div class="db-section-header" style="margin-bottom:1.5rem;">
        <h2>Tracking Progress Details (Ref: ${app.ref})</h2>
      </div>
      <div class="tracker-timeline">
        ${stepperHtml}
      </div>
    </div>
  `;
}

function loadAdminDashboard() {
  const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
  const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');

  const totalAppsCount = document.getElementById('adminTotalApps');
  const pendingAppsCount = document.getElementById('adminPendingApps');
  const approvedAppsCount = document.getElementById('adminApprovedApps');
  const totalOutstanding = document.getElementById('adminOutstandingAmt');

  let pending = 0, approved = 0, outstanding = 0;

  apps.forEach(app => {
    if (app.status === 'Submitted' || app.status === 'Under Review' || app.status === 'Verification') pending++;
    else if (app.status === 'Approved') approved++;

    if (app.status === 'Approved') outstanding += app.amount;
  });

  if (totalAppsCount) totalAppsCount.textContent = apps.length;
  if (pendingAppsCount) pendingAppsCount.textContent = pending;
  if (approvedAppsCount) approvedAppsCount.textContent = approved;
  if (totalOutstanding) totalOutstanding.textContent = `$${outstanding.toLocaleString()}`;

  const appRates = [25, 45, 15, 30, 10, 50];
  const barElements = document.querySelectorAll('.analytics-chart-widget .chart-bar');
  barElements.forEach((bar, idx) => {
    if (idx < appRates.length) {
      bar.style.height = `${appRates[idx]}%`;
    }
  });

  const adminAppsTbody = document.getElementById('adminApplicationsTbody');
  if (adminAppsTbody) {
    function renderAdminTable() {
      adminAppsTbody.innerHTML = '';
      const currentApps = JSON.parse(localStorage.getItem('loanApplications') || '[]');

      if (currentApps.length === 0) {
        adminAppsTbody.innerHTML = `<tr><td colspan="7" class="text-center">No incoming applications.</td></tr>`;
        return;
      }

      currentApps.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${app.ref}</strong></td>
          <td>${app.name}</td>
          <td>${app.loanType}</td>
          <td>$${app.amount.toLocaleString()}</td>
          <td><span class="badge ${app.status === 'Approved' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}">${app.status}</span></td>
          <td>${app.date}</td>
          <td style="display:flex; gap:0.5rem;">
            ${app.status !== 'Approved' && app.status !== 'Rejected' ? `
              <button class="btn btn-secondary action-approve" data-ref="${app.ref}" style="padding:0.3rem 0.6rem; font-size:0.75rem;">Approve</button>
              <button class="btn btn-outline action-reject" data-ref="${app.ref}" style="padding:0.3rem 0.6rem; font-size:0.75rem; border-color:var(--state-danger); color:var(--state-danger);">Reject</button>
            ` : `--`}
          </td>
        `;
        adminAppsTbody.appendChild(tr);
      });

      document.querySelectorAll('.action-approve').forEach(btn => {
        btn.addEventListener('click', () => {
          updateStatus(btn.getAttribute('data-ref'), 'Approved');
        });
      });
      document.querySelectorAll('.action-reject').forEach(btn => {
        btn.addEventListener('click', () => {
          updateStatus(btn.getAttribute('data-ref'), 'Rejected');
        });
      });
    }

    function updateStatus(ref, status) {
      const currentApps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      const idx = currentApps.findIndex(a => a.ref === ref);
      if (idx !== -1) {
        currentApps[idx].status = status;
        currentApps[idx].stage = status === 'Approved' ? 4 : 3;
        localStorage.setItem('loanApplications', JSON.stringify(currentApps));
        renderAdminTable();
        loadAdminDashboard();
      }
    }

    renderAdminTable();
  }

  const adminMsgsTbody = document.getElementById('adminMessagesTbody');
  if (adminMsgsTbody) {
    adminMsgsTbody.innerHTML = '';
    if (msgs.length === 0) {
      adminMsgsTbody.innerHTML = `<tr><td colspan="5" class="text-center">No contact inquiries.</td></tr>`;
      return;
    }

    msgs.forEach(msg => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${msg.id}</strong></td>
        <td>${msg.name}</td>
        <td>${msg.subject}</td>
        <td style="max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${msg.message}</td>
        <td>${msg.date}</td>
      `;
      adminMsgsTbody.appendChild(tr);
    });
  }
}

/* ==========================================================================
   7. FORM VALIDATION HELPERS & CONTACT FORM
   ========================================================================== */
function showError(inputElement, message) {
  const group = inputElement.closest('.form-group');
  if (!group) return;
  group.classList.add('error');
  let feedback = group.querySelector('.form-feedback');
  if (!feedback) {
    feedback = document.createElement('span');
    feedback.className = 'form-feedback';
    group.appendChild(feedback);
  }
  feedback.textContent = message;
}

function clearError(inputElement) {
  const group = inputElement.closest('.form-group');
  if (!group) return;
  group.classList.remove('error');
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('[required]');

  inputs.forEach(input => {
    if (!input.value.trim()) {
      showError(input, 'This field is required');
      isValid = false;
      return;
    } else {
      clearError(input);
    }

    const val = input.value.trim();
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(input, 'Enter a valid email address');
        isValid = false;
      }
    } else if (input.classList.contains('validate-name')) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(val)) {
        showError(input, 'Must contain letters and spaces only');
        isValid = false;
      }
    } else if (input.type === 'tel' || input.classList.contains('validate-tel')) {
      const clean = val.replace(/[\s\-\+]/g, '');
      if (!/^\d+$/.test(clean) || clean.length < 10 || clean.length > 15) {
        showError(input, 'Enter a valid mobile number (10-15 digits)');
        isValid = false;
      }
    } else if (input.type === 'number') {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        showError(input, 'Negative values are not allowed');
        isValid = false;
      } else if (input.classList.contains('validate-age')) {
        if (num < 18 || num > 70) {
          showError(input, 'Age must be between 18 and 70');
          isValid = false;
        }
      } else if (input.classList.contains('validate-amount')) {
        if (num <= 0) {
          showError(input, 'Must be greater than zero');
          isValid = false;
        }
      }
    }
  });

  return isValid;
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(contactForm)) {
      const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const newMsg = {
        id: 'MSG-' + Math.floor(Math.random() * 9000 + 1000),
        name: document.getElementById('cName').value,
        email: document.getElementById('cEmail').value,
        mobile: document.getElementById('cPhone').value,
        subject: document.getElementById('cSubject').value,
        message: document.getElementById('cMessage').value,
        date: new Date().toLocaleDateString()
      };
      msgs.unshift(newMsg);
      localStorage.setItem('contactMessages', JSON.stringify(msgs));

      alert('Message sent successfully! Support will email you back shortly.');
      contactForm.reset();
    }
  });
}

/* ==========================================================================
   8. VIEWPORT SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-reveal');
  
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

function initRealTimeInputValidation() {
  // Validate name inputs (allow letters, spaces, hyphens, and apostrophes)
  document.querySelectorAll('.validate-name').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s\-']/g, '');
    });
  });

  // Validate phone/digit inputs (allow digits and common phone characters like + - ( ) space)
  document.querySelectorAll('input[type="tel"], .validate-phone').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^\d\+\-\(\)\s]/g, '');
    });
  });
}

