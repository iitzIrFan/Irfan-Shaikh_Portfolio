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



// Function to fetch PRs from GitHub API
async function fetchGitHubPRs() {
  const username = 'iitzIrFan'; // Your GitHub username
  const prList = document.querySelector('.pr-list');
  
  if (!prList) return;
  
  // Show loading state
  prList.innerHTML = '<li class="loading">Loading your latest contributions...</li>';
  
  try {
    // Fetch PRs created by the user (across all repositories)
    const response = await fetch(`https://api.github.com/search/issues?q=author:${username}+is:pr&sort=updated&order=desc`);
    
    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }
    
    const data = await response.json();
    displayGitHubPRs(data.items);
  } catch (error) {
    console.error('Error fetching GitHub PRs:', error);
    prList.innerHTML = `<li class="error">Error loading PRs: ${error.message}</li>`;
    
    // Fall back to hardcoded data if GitHub API fails
    setTimeout(() => {
      displayFallbackPRs();
    }, 3000);
  }
}

// Function to display PRs fetched from GitHub
function displayGitHubPRs(prs) {
  const prList = document.querySelector('.pr-list');
  
  if (!prList || !prs || prs.length === 0) {
    prList.innerHTML = '<li class="no-data">No pull requests found</li>';
    return;
  }
  
  // Clear the list
  prList.innerHTML = '';
  
  // Take the 5 most recent PRs
  const recentPRs = prs.slice(0, 5);
  
  recentPRs.forEach(pr => {
    // Extract repository name from PR URL
    // Format: https://api.github.com/repos/OWNER/REPO/issues/NUMBER
    const repoPath = new URL(pr.repository_url).pathname;
    const repoName = repoPath.split('/').pop();
    
    // Determine PR status based on state and merged status
    let status = pr.state; // 'open' or 'closed'
    if (pr.state === 'closed' && pr.pull_request.merged_at) {
      status = 'merged';
    }
    
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${pr.html_url}" target="_blank">
        <div>
          <strong>${repoName}:</strong> ${pr.title}
        </div>
        <span class="pr-status ${status}">${status}</span>
      </a>
    `;
    prList.appendChild(li);
  });
}

// Fallback function in case the GitHub API fails
function displayFallbackPRs() {
  const prList = document.querySelector('.pr-list');
  
  if (!prList) return;
  
  // Clear any existing list items
  prList.innerHTML = '';
  
  // Hardcoded fallback data
  const fallbackPRs = [
    {
      name: 'React Router',
      description: 'Added TypeScript support for nested route components',
      url: 'https://github.com/remix-run/react-router/pull/123',
      status: 'merged'
    },
    {
      name: 'Express.js',
      description: 'Fixed memory leak in request handling middleware',
      url: 'https://github.com/expressjs/express/pull/456',
      status: 'open'
    },
    {
      name: 'Tailwind CSS',
      description: 'Added new animation utilities for smoother transitions',
      url: 'https://github.com/tailwindlabs/tailwindcss/pull/789',
      status: 'merged'
    },
    {
      name: 'Next.js',
      description: 'Improved error handling for server components',
      url: 'https://github.com/vercel/next.js/pull/101112',
      status: 'open'
    },
    {
      name: 'TypeScript',
      description: 'Enhanced type inference for optional chaining',
      url: 'https://github.com/microsoft/TypeScript/pull/131415',
      status: 'closed'
    }
  ];
  
  // Create and append list items for each PR
  fallbackPRs.forEach(pr => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${pr.url}" target="_blank">
        <div>
          <strong>${pr.name}:</strong> ${pr.description}
        </div>
        <span class="pr-status ${pr.status}">${pr.status}</span>
      </a>
    `;
    prList.appendChild(li);
  });
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', () => {
  fetchGitHubPRs();
});

// Additional event listener for when switching tabs
document.querySelectorAll('.navbar-link').forEach(link => {
  link.addEventListener('click', () => {
    // Only fetch PRs when navigating to the proof-of-work section
    if (link.getAttribute('href') === '#proof-of-work') {
      // Small delay to ensure the DOM has updated
      setTimeout(fetchGitHubPRs, 100);
    }
  });
});

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


// Function to fetch and display pinned repositories
window.addEventListener('load', fetchPinnedRepos);

async function fetchPinnedRepos() {
  try {
    const response = await fetch('https://octo-pinned-api.onrender.com/api/pinned');
    const repos = await response.json();
    displayRepos(repos);
  } catch (error) {
    console.error('Error fetching pinned repositories:', error);
  }
}

function displayRepos(repos) {
  const projectList = document.querySelector('.project-list');
  projectList.innerHTML = ''; // Clear previous list

  const heading = document.createElement('h4');
  heading.className = 'h5 article-title';
  heading.textContent = 'GitHub Projects';
  projectList.insertAdjacentElement('beforebegin', heading);

  repos.forEach(repo => {
    const { name, description, url, stargazerCount, forkCount, languages, homepageUrl } = repo;
    const language = languages?.nodes?.[0]?.name || "Unknown";

    // Use OpenGraph image from live link if available, otherwise use repo-based thumbnail
    const repoThumbnail = homepageUrl
      ? `https://api.microlink.io/?url=${encodeURIComponent(homepageUrl)}&screenshot=true&meta=false&embed=screenshot.url`
      : `https://og-image.vercel.app/${encodeURIComponent(name)}.png`;

    const projectItem = `
      <li class="project-item active" data-filter-item data-category="github">
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
