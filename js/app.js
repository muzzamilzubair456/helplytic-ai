// ============================================
// HELPHUB AI - COMPLETE JAVASCRIPT
// ============================================

// Data Store (LocalStorage)
const DataStore = {
    get(key) {
        const data = localStorage.getItem(`helphub_${key}`);
        return data ? JSON.parse(data) : null;
    },
    
    set(key, value) {
        localStorage.setItem(`helphub_${key}`, JSON.stringify(value));
    },
    
    init() {
        if (!this.get('users')) {
            this.set('users', [
                { id: 1, name: 'Ayesha Khan', email: 'ayesha@helphub.ai', role: 'both', location: 'Karachi', skills: ['Figma', 'UI/UX', 'HTML/CSS', 'Career Guidance'], trustScore: 100, contributions: 35, badges: ['Design Ally', 'Fast Responder', 'Top Mentor'] },
                { id: 2, name: 'Sara Noor', email: 'sara@helphub.ai', role: 'helper', location: 'Karachi', skills: ['Python', 'Data Analysis'], trustScore: 74, contributions: 11, badges: ['Community Voice'] },
                { id: 3, name: 'Hassan Ali', email: 'hassan@helphub.ai', role: 'helper', location: 'Lahore', skills: ['JavaScript', 'React', 'Git/GitHub'], trustScore: 88, contributions: 24, badges: ['Code Rescuer', 'Bug Hunter'] }
            ]);
        }
        
        if (!this.get('requests')) {
            this.set('requests', [
                { id: 1, title: 'Need help', description: 'help needed', category: 'Web Development', urgency: 'High', status: 'Solved', author: 'Ayesha Khan', location: 'Karachi', helpers: 1, tags: ['HTML/CSS'] },
                { id: 2, title: 'Need help making my portfolio responsive before demo day', description: 'My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.', category: 'Web Development', urgency: 'High', status: 'Solved', author: 'Sara Noor', location: 'Karachi', helpers: 1, tags: ['HTML/CSS', 'Responsive', 'Portfolio'] },
                { id: 3, title: 'Looking for Figma feedback on a volunteer event poster', description: 'I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.', category: 'Design', urgency: 'Medium', status: 'Open', author: 'Ayesha Khan', location: 'Lahore', helpers: 1, tags: ['Figma', 'Poster', 'Design Review'] },
                { id: 4, title: 'Need mock interview support for internship applications', description: 'Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.', category: 'Career', urgency: 'Low', status: 'Solved', author: 'Sara Noor', location: 'Remote', helpers: 2, tags: ['Interview Prep', 'Career', 'Frontend'] }
            ]);
        }
        
        if (!this.get('messages')) {
            this.set('messages', [
                { id: 1, from: 'Ayesha Khan', to: 'Sara Noor', content: 'I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.', time: '09:45 AM', read: false },
                { id: 2, from: 'Hassan Ali', to: 'Ayesha Khan', content: 'Your event poster concept is solid. I would tighten the CTA and reduce the background texture.', time: '11:10 AM', read: false }
            ]);
        }
        
        if (!this.get('notifications')) {
            this.set('notifications', [
                { id: 1, title: '"Need help" was marked as solved', type: 'Status', time: 'Just now', read: false },
                { id: 2, title: 'Ayesha Khan offered help on "Need help"', type: 'Match', time: 'Just now', read: false },
                { id: 3, title: 'Your request "Need help" is now live in the community feed', type: 'Request', time: 'Just now', read: false },
                { id: 4, title: 'New helper matched to your responsive portfolio request', type: 'Match', time: '12 min ago', read: false },
                { id: 5, title: 'Your trust score increased after a solved request', type: 'Reputation', time: '1 hr ago', read: false },
                { id: 6, title: 'AI Center detected rising demand for interview prep', type: 'Insight', time: 'Today', read: true }
            ]);
        }
        
        if (!this.get('currentUser')) {
            this.set('currentUser', null);
        }
    }
};

// Auth Manager
const Auth = {
    login(userId) {
        const users = DataStore.get('users');
        const user = users.find(u => u.id === userId);
        if (user) {
            DataStore.set('currentUser', user);
            return true;
        }
        return false;
    },
    
    logout() {
        DataStore.set('currentUser', null);
        window.location.href = 'login.html';
    },
    
    getCurrentUser() {
        return DataStore.get('currentUser');
    },
    
    isLoggedIn() {
        return !!this.getCurrentUser();
    }
};

// UI Helpers
const UI = {
    createTag(text, type = 'primary') {
        return `<span class="tag tag-${type}">${text}</span>`;
    },
    
    createAvatar(name, size = '') {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        return `<div class="avatar ${size}">${initials}</div>`;
    },
    
    formatTime(time) {
        return time;
    },
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    
    initNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
};

// Page Controllers
const Pages = {
    // Login Page
    initLogin() {
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = parseInt(document.getElementById('userSelect').value);
            if (Auth.login(userId)) {
                UI.showToast('Welcome back!');
                setTimeout(() => window.location.href = 'index.html', 500);
            }
        });
    },
    
    // Home Page
    initHome() {
        const statsContainer = document.getElementById('statsContainer');
        if (statsContainer) {
            const requests = DataStore.get('requests') || [];
            const users = DataStore.get('users') || [];
            const solved = requests.filter(r => r.status === 'Solved').length;
            
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-label">Members</div>
                    <div class="stat-number">${users.length}84+</div>
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">Students, mentors, and helpers in the loop.</p>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Requests</div>
                    <div class="stat-number">${requests.length}72+</div>
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">Support posts shared across learning journeys.</p>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Solved</div>
                    <div class="stat-number">${solved}69+</div>
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">Problems resolved through fast community action.</p>
                </div>
            `;
        }
        
        const featuredRequests = document.getElementById('featuredRequests');
        if (featuredRequests) {
            const requests = DataStore.get('requests') || [];
            featuredRequests.innerHTML = requests.slice(0, 3).map(req => `
                <div class="request-card animate-fade-in">
                    <div class="request-header">
                        ${UI.createTag(req.category)}
                        ${UI.createTag(req.urgency, req.urgency === 'High' ? 'danger' : req.urgency === 'Medium' ? 'warning' : 'success')}
                        ${UI.createTag(req.status, req.status === 'Solved' ? 'success' : 'info')}
                    </div>
                    <h3 class="request-title">${req.title}</h3>
                    <p class="request-desc">${req.description}</p>
                    <div class="request-footer">
                        <div>
                            <div class="request-author">${req.author}</div>
                            <div class="request-meta">${req.location} • ${req.helpers} helper interested</div>
                        </div>
                        <button class="btn btn-secondary" onclick="window.location.href='request-detail.html?id=${req.id}'">Open details</button>
                    </div>
                </div>
            `).join('');
        }
    },
    
    // Explore/Feed Page
    initExplore() {
        const feedContainer = document.getElementById('feedContainer');
        const filterCategory = document.getElementById('filterCategory');
        const filterUrgency = document.getElementById('filterUrgency');
        
        const renderRequests = () => {
            let requests = DataStore.get('requests') || [];
            
            const cat = filterCategory?.value;
            const urg = filterUrgency?.value;
            
            if (cat && cat !== 'all') requests = requests.filter(r => r.category === cat);
            if (urg && urg !== 'all') requests = requests.filter(r => r.urgency === urg);
            
            if (feedContainer) {
                feedContainer.innerHTML = requests.map(req => `
                    <div class="request-card animate-fade-in">
                        <div class="request-header">
                            ${UI.createTag(req.category)}
                            ${UI.createTag(req.urgency, req.urgency === 'High' ? 'danger' : req.urgency === 'Medium' ? 'warning' : 'success')}
                            ${UI.createTag(req.status, req.status === 'Solved' ? 'success' : 'info')}
                        </div>
                        <h3 class="request-title">${req.title}</h3>
                        <p class="request-desc">${req.description}</p>
                        <div style="display: flex; gap: 8px; margin: 12px 0; flex-wrap: wrap;">
                            ${req.tags.map(tag => UI.createTag(tag, 'outline')).join('')}
                        </div>
                        <div class="request-footer">
                            <div>
                                <div class="request-author">${req.author}</div>
                                <div class="request-meta">${req.location} • ${req.helpers} helper interested</div>
                            </div>
                            <button class="btn btn-secondary" onclick="window.location.href='request-detail.html?id=${req.id}'">Open details</button>
                        </div>
                    </div>
                `).join('');
            }
        };
        
        filterCategory?.addEventListener('change', renderRequests);
        filterUrgency?.addEventListener('change', renderRequests);
        renderRequests();
    },
    
    // AI Center Page
    initAICenter() {
        const aiRecommendations = document.getElementById('aiRecommendations');
        if (aiRecommendations) {
            const requests = DataStore.get('requests') || [];
            aiRecommendations.innerHTML = requests.map(req => `
                <div class="request-card" style="border-left: 4px solid var(--primary);">
                    <h4 style="margin-bottom: 8px;">${req.title}</h4>
                    <p style="font-size: 0.9rem; margin-bottom: 12px;">
                        AI summary: ${req.category} request with ${req.urgency.toLowerCase()} urgency. 
                        Best suited for members with relevant expertise.
                    </p>
                    <div style="display: flex; gap: 8px;">
                        ${UI.createTag(req.category)}
                        ${UI.createTag(req.urgency, req.urgency === 'High' ? 'danger' : 'warning')}
                    </div>
                </div>
            `).join('');
        }
    },
    
    // Profile Page
    initProfile() {
        const user = Auth.getCurrentUser() || DataStore.get('users')[0];
        if (!user) return;
        
        const profileHeader = document.getElementById('profileHeader');
        if (profileHeader) {
            profileHeader.innerHTML = `
                <div class="hero-banner">
                    <div class="hero-label">Profile</div>
                    <h1>${user.name}</h1>
                    <p style="color: var(--text-light);">${user.role.charAt(0).toUpperCase() + user.role.slice(1)} • ${user.location}</p>
                </div>
            `;
        }
        
        const profileStats = document.getElementById('profileStats');
        if (profileStats) {
            profileStats.innerHTML = `
                <div style="display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border);">
                    <span>Trust score</span>
                    <span style="font-weight: 700;">${user.trustScore}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border);">
                    <span>Contributions</span>
                    <span style="font-weight: 700;">${user.contributions}</span>
                </div>
                <div style="margin-top: 16px;">
                    <h4 style="margin-bottom: 12px;">Skills</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${user.skills.map(skill => UI.createTag(skill)).join('')}
                    </div>
                </div>
                <div style="margin-top: 16px;">
                    <h4 style="margin-bottom: 12px;">Badges</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${user.badges.map(badge => UI.createTag(badge, 'success')).join('')}
                    </div>
                </div>
            `;
        }
        
        const editForm = document.getElementById('editProfileForm');
        if (editForm) {
            document.getElementById('editName').value = user.name;
            document.getElementById('editLocation').value = user.location;
            document.getElementById('editSkills').value = user.skills.join(', ');
            document.getElementById('editInterests').value = 'Hackathons, UI/UX, Community Building';
            
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                UI.showToast('Profile updated successfully!');
            });
        }
    },
    
    // Messages Page
    initMessages() {
        const messageList = document.getElementById('messageList');
        const messages = DataStore.get('messages') || [];
        
        if (messageList) {
            messageList.innerHTML = messages.map(msg => `
                <div class="message-item">
                    <div class="message-header">
                        <span class="message-sender">${msg.from} → ${msg.to}</span>
                        <span class="message-time">${msg.time}</span>
                    </div>
                    <p class="message-preview">${msg.content}</p>
                </div>
            `).join('');
        }
        
        const sendForm = document.getElementById('sendMessageForm');
        if (sendForm) {
            sendForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const to = document.getElementById('messageTo').value;
                const content = document.getElementById('messageContent').value;
                
                const newMsg = {
                    id: Date.now(),
                    from: Auth.getCurrentUser()?.name || 'You',
                    to,
                    content,
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    read: false
                };
                
                messages.push(newMsg);
                DataStore.set('messages', messages);
                UI.showToast('Message sent!');
                this.initMessages();
                sendForm.reset();
            });
        }
    },
    
    // Create Request Page
    initCreateRequest() {
        const form = document.getElementById('createRequestForm');
        const aiSuggestions = document.getElementById('aiSuggestions');
        
        if (aiSuggestions) {
            document.getElementById('suggestedCategory').textContent = 'Community';
            document.getElementById('detectedUrgency').textContent = 'Low';
            document.getElementById('suggestedTags').textContent = 'Add more detail for smarter tags';
            document.getElementById('rewriteSuggestion').textContent = 'Start describing the challenge to generate a stronger version.';
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('reqTitle').value;
                const description = document.getElementById('reqDesc').value;
                const category = document.getElementById('reqCategory').value;
                const urgency = document.getElementById('reqUrgency').value;
                const tags = document.getElementById('reqTags').value.split(',').map(t => t.trim());
                
                const requests = DataStore.get('requests') || [];
                requests.push({
                    id: Date.now(),
                    title,
                    description,
                    category,
                    urgency,
                    status: 'Open',
                    author: Auth.getCurrentUser()?.name || 'Anonymous',
                    location: Auth.getCurrentUser()?.location || 'Remote',
                    helpers: 0,
                    tags
                });
                
                DataStore.set('requests', requests);
                UI.showToast('Request published successfully!');
                setTimeout(() => window.location.href = 'explore.html', 1000);
            });
        }
        
        document.getElementById('applyAI')?.addEventListener('click', () => {
            UI.showToast('AI suggestions applied!');
        });
    },
    
    // Leaderboard Page
    initLeaderboard() {
        const rankingsList = document.getElementById('rankingsList');
        const users = DataStore.get('users') || [];
        
        if (rankingsList) {
            rankingsList.innerHTML = users.sort((a, b) => b.trustScore - a.trustScore).map((user, index) => `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    ${UI.createAvatar(user.name)}
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${user.name}</div>
                        <div class="leaderboard-skills">${user.skills.join(', ')}</div>
                    </div>
                    <div class="leaderboard-score">
                        <div class="score-value">${user.trustScore}%</div>
                        <div class="score-label">${user.contributions} contributions</div>
                    </div>
                </div>
            `).join('');
        }
        
        const badgeList = document.getElementById('badgeList');
        if (badgeList) {
            badgeList.innerHTML = users.map(user => `
                <div class="card" style="margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        ${UI.createAvatar(user.name)}
                        <div>
                            <div style="font-weight: 700;">${user.name}</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">${user.badges.join(' • ')}</div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${user.trustScore}%;"></div>
                    </div>
                </div>
            `).join('');
        }
    },
    
    // Notifications Page
    initNotifications() {
        const notificationList = document.getElementById('notificationList');
        const notifications = DataStore.get('notifications') || [];
        
        if (notificationList) {
            notificationList.innerHTML = notifications.map(notif => `
                <div class="notification-item">
                    <div class="notification-content">
                        <h4>${notif.title}</h4>
                        <p>${notif.type} • ${notif.time}</p>
                    </div>
                    <span class="notification-status ${notif.read ? 'status-read' : 'status-unread'}">
                        ${notif.read ? 'Read' : 'Unread'}
                    </span>
                </div>
            `).join('');
        }
    },
    
    // Request Detail Page
    initRequestDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const reqId = parseInt(urlParams.get('id'));
        const requests = DataStore.get('requests') || [];
        const request = requests.find(r => r.id === reqId);
        
        if (!request) return;
        
        const detailHeader = document.getElementById('detailHeader');
        if (detailHeader) {
            detailHeader.innerHTML = `
                <div class="hero-banner">
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        ${UI.createTag(request.category)}
                        ${UI.createTag(request.urgency, request.urgency === 'High' ? 'danger' : 'warning')}
                        ${UI.createTag(request.status, request.status === 'Solved' ? 'success' : 'info')}
                    </div>
                    <h1>${request.title}</h1>
                    <p style="color: var(--text-light); margin-top: 12px;">${request.description}</p>
                </div>
            `;
        }
        
        const aiSummary = document.getElementById('aiSummary');
        if (aiSummary) {
            aiSummary.innerHTML = `
                <p style="margin-bottom: 16px;">${request.description} Best helpers are ${request.category.toLowerCase()} mentors comfortable with relevant technologies.</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${request.tags.map(tag => UI.createTag(tag)).join('')}
                </div>
            `;
        }
        
        const helpersList = document.getElementById('helpersList');
        if (helpersList) {
            const users = DataStore.get('users') || [];
            helpersList.innerHTML = users.slice(0, 2).map(user => `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    ${UI.createAvatar(user.name)}
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${user.name}</div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">${user.skills.slice(0, 3).join(', ')}</div>
                    </div>
                    <span class="tag tag-success">Trust ${user.trustScore}%</span>
                </div>
            `).join('');
        }
        
        document.getElementById('helpBtn')?.addEventListener('click', () => {
            UI.showToast('You offered to help!');
        });
        
        document.getElementById('solveBtn')?.addEventListener('click', () => {
            request.status = 'Solved';
            DataStore.set('requests', requests);
            UI.showToast('Request marked as solved!');
            setTimeout(() => location.reload(), 500);
        });
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    DataStore.init();
    UI.initNavigation();
    
    // Init page-specific controllers
    Pages.initLogin();
    Pages.initHome();
    Pages.initExplore();
    Pages.initAICenter();
    Pages.initProfile();
    Pages.initMessages();
    Pages.initCreateRequest();
    Pages.initLeaderboard();
    Pages.initNotifications();
    Pages.initRequestDetail();
    
    // Global event listeners
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
    });
});