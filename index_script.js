// 전역 변수
const currentUser = "수연이";
const appliedTeams = new Set();

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details')) {
            const card = e.target.closest('.card');
            const teamName = card.querySelector('.card-title').textContent;
            const members = card.querySelector('.members').textContent.trim();
            
            const creator = e.target.dataset.creator || "떡보끼";
            const createdDate = e.target.dataset.createdDate || "2024-03-15";
            const meetingDate = e.target.dataset.meetingDate || "매주 수요일 오후 7:30";
            
            const detailsHTML = `
                <p>팀 이름: ${teamName}</p>
                <p>개설자: ${creator}</p>
                <p>개설 날짜: ${createdDate}</p>
                <p>모임 날짜: ${meetingDate}</p>
            `;
            
            document.getElementById('teamDetails').innerHTML = detailsHTML;
            
            const joinButton = document.getElementById('joinTeamBtn');
            if (creator === currentUser) {
                joinButton.style.display = 'none';
            } else if (appliedTeams.has(teamName)) {
                joinButton.style.display = 'none';
                const appliedMessage = document.createElement('p');
                appliedMessage.textContent = '이미 지원을 완료했습니다.';
                appliedMessage.style.color = '#666';
                document.getElementById('teamDetails').appendChild(appliedMessage);
            } else {
                joinButton.style.display = 'block';
            }
            
            showModal('teamDetailModal');
        }
    });

    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal.id);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });

    document.getElementById('joinTeamBtn')?.addEventListener('click', function() {
        hideModal('teamDetailModal');
        showModal('introductionModal');
    });

    document.getElementById('submitIntroBtn')?.addEventListener('click', function() {
        const introduction = document.getElementById('introText').value;
        if (introduction.trim()) {
            const teamName = document.querySelector('#teamDetails p').textContent.split(': ')[1];
            appliedTeams.add(teamName);
            
            alert('가입이 신청되었습니다.');
            hideModal('introductionModal');
            document.getElementById('introText').value = ''; // 입력창 초기화
        } else {
            alert('자기소개를 입력해주세요.');
        }
    });

    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const dropdownMenu = this.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = 
                        dropdownMenu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('more-options')) {
        const card = e.target.closest('.card');

        document.getElementById('hideTeamBtn').dataset.cardId = Array.from(card.parentElement.children).indexOf(card);
        showModal('teamOptionsModal');
    }
});

document.getElementById('hideTeamBtn').addEventListener('click', function() {
    const cardIndex = this.dataset.cardId;
    const cards = document.querySelectorAll('.card');
    if (cardIndex !== undefined && cards[cardIndex]) {
        cards[cardIndex].remove();
    }
    hideModal('teamOptionsModal');
});

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        hideModal(modal.id);
    });
});

function loadTeamData() {
    return [
        {
            title: "떡볶이 팀",
            members: "3/4",
            description: "Climate change is beginning to have a devastating impact on forests across the world",
            creator: "떡보끼",
            createdDate: "2024-03-15",
            meetingDate: "매주 수요일 오후 7:30"
        }
    ];
}

function createTeamCard(teamData) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="./images/team.png" alt="팀 이미지" class="card-image">
        <div class="card-content">
            <div class="card-header">
                <span class="card-title">${teamData.title}</span>
                <button class="more-options">⋮</button>
            </div>
            <div class="card-meta">
                <span class="members">
                    <i class="fa-solid fa-user"></i> ${teamData.members}
                </span>
            </div>
            <p class="card-description">${teamData.description}</p>
            <button class="view-details" 
                data-creator="${teamData.creator}"
                data-created-date="${teamData.createdDate}"
                data-meeting-date="${teamData.meetingDate}">
                자세히 보기
            </button>
        </div>
    `;

    const viewDetailsBtn = card.querySelector('.view-details');
    const moreOptionsBtn = card.querySelector('.more-options');
    
    viewDetailsBtn.addEventListener('click', function() {
        const teamName = card.querySelector('.card-title').textContent;
        const members = card.querySelector('.members').textContent.trim();
        
        const detailsHTML = `
            <p>팀 이름: ${teamData.title}</p>
            <p>개설자: ${teamData.creator}</p>
            <p>개설 날짜: ${teamData.createdDate}</p>
            <p>모임 날짜: ${teamData.meetingDate}</p>
        `;
        
        document.getElementById('teamDetails').innerHTML = detailsHTML;
        showModal('teamDetailModal');
    });

    moreOptionsBtn.addEventListener('click', function() {
        document.getElementById('hideTeamBtn').dataset.cardId = 
            Array.from(card.parentElement.children).indexOf(card);
        showModal('teamOptionsModal');
    });
    return card;
}

document.addEventListener('DOMContentLoaded', function() {
    const teamData = loadTeamData();
    const featuredGrid = document.querySelector('.featured-grid');
    if (featuredGrid) {
        teamData.forEach(team => {
            featuredGrid.appendChild(createTeamCard(team));
        });
    }
});

window.onload = function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        const navSignin = document.querySelector(".signin");
        navSignin.style.display = "none";

        const nav = document.querySelector(".nav");
        const userIcon = document.createElement("div");
        userIcon.className = "user-icon";
        userIcon.innerHTML = `<i class="fa-regular fa-user"></i>`;
        nav.appendChild(userIcon);
    }
};

window.onload = function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        const navSignin = document.querySelector(".signin");
        navSignin.style.display = "none";

        const nav = document.querySelector(".nav");
        const userIcon = document.createElement("div");
        userIcon.className = "user-icon";
        userIcon.innerHTML = `<i class="fa-regular fa-user"></i>`;
        nav.appendChild(userIcon);
    }
};
