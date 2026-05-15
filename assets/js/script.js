'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }





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

// horizontal scroll buttons functionality
const scrollBtns = document.querySelectorAll("[data-scroll-btn]");

scrollBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    const sectionName = this.dataset.scrollBtn;
    const scrollContainer = document.querySelector(`.${sectionName}-list`);
    
    if (scrollContainer) {
      // Calculate scroll amount based on visible width (about one card)
      const scrollAmount = scrollContainer.clientWidth > 400 ? 300 : scrollContainer.clientWidth * 0.8; 
      
      if (this.classList.contains("prev")) {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else if (this.classList.contains("next")) {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  });
});



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
// Redundant navigation logic removed to prevent scroll jumping and conflicts with hash routing

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

// Prevent native anchor jumping which causes UI movement/glitches
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const hash = this.getAttribute('href');
    if (window.location.hash !== hash && (window.location.hash !== '' || hash !== '#about')) {
      history.pushState(null, null, hash);
      showSection(hash);
      // Smoothly scroll to the top of the container if needed, or simply don't scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
