'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// Portfolio filter functionality has been simplified
// Filter buttons removed, all items will be displayed
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

// Show all portfolio items by default
window.addEventListener('DOMContentLoaded', function() {
  for (let i = 0; i < filterItems.length; i++) {
    filterItems[i].classList.add("active");
  }
});

// Filter button functionality removed



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}


// Function to display error/maintenance message
function displayErrorMessage() {
  const projectList = document.querySelector('.project-list');
  
  // Check if error message already exists
  const existingError = document.querySelector('.status-message');
  if (existingError) {
    // Reset retry button state if it exists
    const retryBtn = existingError.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.disabled = false;
      retryBtn.innerHTML = '<ion-icon name="refresh-outline"></ion-icon><span>Try Again</span>';
    }
    return; // Don't recreate the error message
  }
  
  // Check if projects exist and animate them out
  const existingProjects = document.querySelectorAll('.project-item');
  const existingHeading = document.querySelector('.h5.article-title');
  
  if (existingProjects.length > 0 || existingHeading) {
    // Fade out existing projects
    existingProjects.forEach((project, index) => {
      project.style.animation = `fadeOut 0.3s ease forwards ${index * 0.05}s`;
    });
    if (existingHeading) {
      existingHeading.style.animation = 'fadeOut 0.3s ease forwards';
    }
    
    // Wait for fade out to complete, then show error
    setTimeout(() => {
      if (existingHeading) existingHeading.remove();
      projectList.innerHTML = '';
      showErrorCard();
    }, 300 + (existingProjects.length * 50));
  } else {
    projectList.innerHTML = '';
    showErrorCard();
  }
  
  function showErrorCard() {
    const errorCard = `
      <div class="status-message" style="opacity: 0; animation: slideInUp 0.5s ease forwards;">
        <ion-icon name="cloud-offline-outline" class="status-icon"></ion-icon>
        <h3 class="status-title">Unable to Load Projects</h3>
        <p class="status-text">
          Our backend API is currently experiencing connectivity issues. This may be temporary due to server maintenance or network limitations. We appreciate your patience.
        </p>
        <div class="status-actions">
          <button class="retry-btn">
            <ion-icon name="refresh-outline"></ion-icon>
            <span>Try Again</span>
          </button>
          <a href="https://github.com/iitzIrFan" target="_blank" class="github-link-btn">
            <ion-icon name="logo-github"></ion-icon>
            <span>Visit GitHub</span>
          </a>
        </div>
      </div>
    `;

    projectList.insertAdjacentHTML('beforeend', errorCard);
    
    // Attach event listener after button is created
    const retryBtn = projectList.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', handleRetryClick);
    }
  }
}

// Loading state flag to prevent race conditions
let isFetchingRepos = false;

// Retry handler - not exposed globally
function handleRetryClick() {
  // Prevent multiple simultaneous requests
  if (isFetchingRepos) {
    return;
  }
  
  const retryBtn = document.querySelector('.retry-btn');
  if (retryBtn) {
    retryBtn.disabled = true;
    retryBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Loading...</span>';
  }
  fetchPinnedRepos();
}

// Function to fetch and display pinned repositories
window.addEventListener('load', fetchPinnedRepos);

async function fetchPinnedRepos() {
  // Guard against concurrent requests
  if (isFetchingRepos) {
    return;
  }
  
  isFetchingRepos = true;
  
  try {
    const response = await fetch('https://octo-pinned-api.onrender.com/api/pinned');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const repos = await response.json();
    displayRepos(repos);
  } catch (error) {
    console.error('Error fetching pinned repositories:', error);
    displayErrorMessage();
  } finally {
    // Always reset the loading state
    isFetchingRepos = false;
  }
}

function displayRepos(repos) {
  const projectList = document.querySelector('.project-list');
  
  // Check if error message exists and animate it out
  const errorMessage = document.querySelector('.status-message');
  if (errorMessage) {
    errorMessage.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => {
      projectList.innerHTML = '';
      populateProjects();
    }, 400);
  } else {
    projectList.innerHTML = '';
    populateProjects();
  }

  function populateProjects() {
    const heading = document.createElement('h4');
    heading.className = 'h5 article-title';
    heading.textContent = 'GitHub Projects';
    heading.style.opacity = '0';
    heading.style.animation = 'slideInUp 0.5s ease forwards';
    projectList.insertAdjacentElement('beforebegin', heading);

    repos.forEach((repo, index) => {
      const { name, description, url, stargazerCount, forkCount, languages, homepageUrl } = repo;
      const language = languages?.nodes?.[0]?.name || "Unknown";

      // Use OpenGraph image from live link if available, otherwise use repo-based thumbnail
      const repoThumbnail = homepageUrl
        ? `https://api.microlink.io/?url=${encodeURIComponent(homepageUrl)}&screenshot=true&meta=false&embed=screenshot.url`
        : `https://og-image.vercel.app/${encodeURIComponent(name)}.png`;

      const projectItem = `
        <li class="project-item active" data-filter-item data-category="github" style="opacity: 0; animation: slideInUp 0.5s ease forwards ${index * 0.1}s;">
          <a href="${url}" target="_blank">
            <figure class="project-img">
              <div class="project-item-icon-box">
                <ion-icon name="eye-outline"></ion-icon>
              </div>
              <img src="${repoThumbnail}" alt="${name}" loading="lazy">
            </figure>

            <h3 class="project-title">${name}</h3>
            <p class="project-text">${description || 'No description available'}</p>
            <p class="project-category">
              🌟 ${stargazerCount} &nbsp;&nbsp;🍴 ${forkCount} &nbsp;&nbsp;💻 ${language}
            </p>
            ${homepageUrl ? `<p><a href="${homepageUrl}" target="_blank" class="live-preview-btn">Live Project Link</a></p>` : ''}
          </a>
        </li>
      `;

      projectList.insertAdjacentHTML('beforeend', projectItem);
    });
  }
}

const sections = document.querySelectorAll('article');
const navLinks = document.querySelectorAll('.navbar-link');
const aboutSection = document.querySelector('.about');
const aboutLink = document.querySelector('.navbar-link[href="#about"]');

// Function to show the appropriate section based on the hash
function showSection(hash) {
  // Remove the # if it exists
  const sectionId = hash.startsWith('#') ? hash.substring(1) : hash;
  
  // Handle the About section specifically
  if (!sectionId || sectionId === 'about') {
    // Show only the About section
    sections.forEach(section => {
      section.classList.toggle('active', section.classList.contains('about'));
    });
    
    // Make only About link active
    navLinks.forEach(link => {
      link.classList.toggle('active', link === aboutLink);
    });
    
    return;
  }
  
  // For other sections, hide all and show only the selected section
  sections.forEach(section => {
    section.classList.toggle('active', section.id === sectionId);
  });

  navLinks.forEach(link => {
    const linkHash = link.getAttribute('href');
    link.classList.toggle('active', linkHash === `#${sectionId}`);
  });
}

// Initial page load
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    showSection(window.location.hash);
  } else {
    // Default to About section
    showSection('about');
  }
});

// Handle hash changes (navigation)
window.addEventListener('hashchange', () => {
  showSection(window.location.hash);
});



/*-----------------------------------*\
  #PROOF OF WORK - GitHub OSS Contributions
\*-----------------------------------*/

// GitHub API Configuration
const GITHUB_CONFIG = {
  username: 'iitzIrFan',
  token: 'YOUR_GITHUB_TOKEN_HERE', // Replace with your GitHub Personal Access Token
  orgs: ['kestra-io', 'QwikDev', 'recodehive']
};

// Cache for storing fetched data
const orgDataCache = {};

// Proof of Work functionality
const initProofOfWork = () => {
  const orgDropdowns = document.querySelectorAll('.org-dropdown');
  
  orgDropdowns.forEach(dropdown => {
    const header = dropdown.querySelector('.org-dropdown-header');
    const org = dropdown.getAttribute('data-org');
    
    header.addEventListener('click', async () => {
      const isActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      orgDropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      dropdown.classList.toggle('active');
      
      // Fetch data only if opening and not cached
      if (!isActive && !orgDataCache[org]) {
        await fetchAndDisplayOrgIssues(dropdown, org);
      }
    });
  });
};

// Fetch issues from GitHub API
const fetchOrgIssues = async (org, username, token) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  // Add authorization header if token is provided
  if (token && token !== 'YOUR_GITHUB_TOKEN_HERE') {
    headers['Authorization'] = `token ${token}`;
  }
  
  try {
    // Fetch issues where user commented
    const commentedResponse = await fetch(
      `https://api.github.com/search/issues?q=org:${org}+commenter:${username}&sort=updated&per_page=30`,
      { headers }
    );
    
    // Fetch issues assigned to user
    const assignedResponse = await fetch(
      `https://api.github.com/search/issues?q=org:${org}+assignee:${username}&sort=updated&per_page=30`,
      { headers }
    );
    
    // Fetch issues created by user that are now closed
    const closedResponse = await fetch(
      `https://api.github.com/search/issues?q=org:${org}+author:${username}+is:closed&sort=updated&per_page=30`,
      { headers }
    );
    
    // Check for rate limiting
    const rateLimitRemaining = commentedResponse.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining !== null) {
      console.log(`GitHub API Rate Limit Remaining: ${rateLimitRemaining}`);
    }
    
    if (!commentedResponse.ok || !assignedResponse.ok || !closedResponse.ok) {
      throw new Error('Failed to fetch issues from GitHub API');
    }
    
    const commentedData = await commentedResponse.json();
    const assignedData = await assignedResponse.json();
    const closedData = await closedResponse.json();
    
    return {
      commented: commentedData.items || [],
      assigned: assignedData.items || [],
      closed: closedData.items || [],
      rateLimitRemaining
    };
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    throw error;
  }
};

// Fetch and display organization issues
const fetchAndDisplayOrgIssues = async (dropdown, org) => {
  const container = dropdown.querySelector('.org-issues-container');
  const spinner = dropdown.querySelector('.loading-spinner');
  
  // Show loading spinner
  spinner.style.display = 'flex';
  container.innerHTML = '';
  
  try {
    const data = await fetchOrgIssues(org, GITHUB_CONFIG.username, GITHUB_CONFIG.token);
    
    // Cache the data
    orgDataCache[org] = data;
    
    // Hide spinner
    spinner.style.display = 'none';
    
    // Display the issues
    displayOrgIssues(container, data.commented, data.assigned, data.closed);
    
  } catch (error) {
    spinner.style.display = 'none';
    container.innerHTML = `
      <div class="empty-state">
        <ion-icon name="alert-circle-outline"></ion-icon>
        <p>Failed to load contributions. Please check your GitHub token and try again.</p>
      </div>
    `;
  }
};

// Display organization issues
const displayOrgIssues = (container, commentedIssues, assignedIssues, closedIssues) => {
  let html = '<div class="issues-grid">';
  
  // Commented Issues Section
  html += `
    <div class="issue-section">
      <h4 class="issue-section-title">
        <ion-icon name="chatbox-outline"></ion-icon>
        <span>Commented On</span>
        <span class="issue-count">(${commentedIssues.length})</span>
      </h4>
  `;
  
  if (commentedIssues.length > 0) {
    html += `
      <div class="issue-list">
        ${commentedIssues.map(issue => createIssueHTML(issue)).join('')}
      </div>
    `;
  } else {
    html += `
      <div class="empty-state">
        <ion-icon name="document-outline"></ion-icon>
        <p>No commented issues</p>
      </div>
    `;
  }
  
  html += `</div>`;
  
  // Assigned Issues Section
  html += `
    <div class="issue-section">
      <h4 class="issue-section-title">
        <ion-icon name="person-outline"></ion-icon>
        <span>Assigned to Me</span>
        <span class="issue-count">(${assignedIssues.length})</span>
      </h4>
  `;
  
  if (assignedIssues.length > 0) {
    html += `
      <div class="issue-list">
        ${assignedIssues.map(issue => createIssueHTML(issue)).join('')}
      </div>
    `;
  } else {
    html += `
      <div class="empty-state">
        <ion-icon name="document-outline"></ion-icon>
        <p>No assigned issues</p>
      </div>
    `;
  }
  
  html += `</div>`;
  
  // Closed Issues Section
  html += `
    <div class="issue-section">
      <h4 class="issue-section-title">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <span>Closed by Me</span>
        <span class="issue-count">(${closedIssues.length})</span>
      </h4>
  `;
  
  if (closedIssues.length > 0) {
    html += `
      <div class="issue-list">
        ${closedIssues.map(issue => createIssueHTML(issue)).join('')}
      </div>
    `;
  } else {
    html += `
      <div class="empty-state">
        <ion-icon name="document-outline"></ion-icon>
        <p>No closed issues</p>
      </div>
    `;
  }
  
  html += `</div></div>`;
  
  container.innerHTML = html;
};

// Create HTML for a single issue
const createIssueHTML = (issue) => {
  const repoName = issue.repository_url.split('/').slice(-2).join('/');
  const createdDate = new Date(issue.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const labelsHTML = issue.labels && issue.labels.length > 0
    ? `<div class="issue-labels">
        ${issue.labels.slice(0, 3).map(label => 
          `<span class="issue-label">${label.name}</span>`
        ).join('')}
        ${issue.labels.length > 3 ? `<span class="issue-label">+${issue.labels.length - 3} more</span>` : ''}
      </div>`
    : '';
  
  return `
    <div class="issue-item">
      <div class="issue-header">
        <a href="${issue.html_url}" target="_blank" rel="noopener" class="issue-title-link">
          ${issue.title}
        </a>
        <span class="issue-state ${issue.state}">${issue.state}</span>
      </div>
      <div class="issue-meta">
        <span class="issue-repo">
          <ion-icon name="git-branch-outline"></ion-icon>
          ${repoName}
        </span>
        <span class="issue-date">
          <ion-icon name="calendar-outline"></ion-icon>
          ${createdDate}
        </span>
      </div>
      ${labelsHTML}
    </div>
  `;
};

// Initialize Proof of Work when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProofOfWork);
} else {
  initProofOfWork();
}
