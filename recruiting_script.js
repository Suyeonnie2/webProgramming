document.querySelector('.search-bar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const teamName = card.querySelector('.card-title').textContent.toLowerCase();
        if (teamName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

const appliedTeams = new Set();

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-details')) {
        const card = e.target.closest('.card');
        const button = e.target;
        const teamName = card.querySelector('.card-title').textContent;
        const members = card.querySelector('.members').textContent.trim();

        const creator = button.dataset.creator || "떡보끼"; 
        const createdDate = button.dataset.createdDate || "2024-03-15"; 
        const meetingDate = button.dataset.meetingDate || "매주 수요일 오후 7:30"; 
        
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

document.getElementById('joinTeamBtn').addEventListener('click', function() {
    hideModal('teamDetailModal');
    showModal('introductionModal');
});

document.getElementById('submitIntroBtn').addEventListener('click', function() {
    const introduction = document.getElementById('introText').value;
    if (introduction.trim()) {
        const teamName = document.querySelector('#teamDetails p').textContent.split(': ')[1];
        appliedTeams.add(teamName); 
        
        alert('가입을 신청했습니다.');
        hideModal('introductionModal');
        hideModal('teamDetailModal');
        document.getElementById('introText').value = '';
    }
});


document.querySelector('.create-group').addEventListener('click', function() {
    showModal('createTeamModal');
});

const currentUser = "수연이";

document.getElementById('createTeamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const cardsGrid = document.querySelector('.cards-grid');
    const newCard = document.createElement('div');
    newCard.className = 'card';
    
    const today = new Date().toISOString().split('T')[0];
    
    const imageFile = formData.get('teamImage');
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newCard.innerHTML = `
                <div class="card-content">
                <img src="${e.target.result}" alt="팀 이미지" class="card-image">
                    <div class="card-header">
                        <span class="card-title">${formData.get('teamName')}</span>
                        <button class="more-options">⋮</button>
                    </div>
                    <div class="card-meta">
                        <span class="members">
                            <i class="fa-solid fa-user"></i> 1/${formData.get('maxMembers')}
                        </span>
                    </div>
                    <p class="card-description">${formData.get('description')}</p>
                    <button class="view-details" 
                            data-creator="${currentUser}"
                            data-created-date="${today}"
                            data-meeting-date="${formData.get('meetingDate')}">자세히 보기</button>
                </div>
            `;
            cardsGrid.appendChild(newCard);
            alert('개설이 완료되었습니다.');
            hideModal('createTeamModal');
            this.reset();
        }.bind(this);
        reader.readAsDataURL(imageFile);
    }
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