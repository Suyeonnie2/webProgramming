function sendMessage(fileUrl = null) {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message || fileUrl) {
        const chatArea = document.getElementById('chatArea');
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let messageContent = '';
        if (fileUrl) {
            messageContent = `<div class="file-attachment">
                <i class="fas fa-file"></i>
                <a href="${fileUrl}" target="_blank">${fileUrl.split('/').pop()}</a>
            </div>`;
        }
        if (message) {
            messageContent += `<div class="text">${message}</div>`;
        }
        
        const messageHTML = `
            <div class="message my-message">
                <div class="message-content">
                    ${messageContent}
                </div>
                <div class="timestamp">${timeString}</div>
            </div>
        `;
        
        chatArea.insertAdjacentHTML('beforeend', messageHTML);
        chatArea.scrollTop = chatArea.scrollHeight;
        input.value = '';
    }
}

function attachFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const fakeFileUrl = `/uploads/${file.name}`;
            sendMessage(fakeFileUrl);
        }
    };
    
    fileInput.click();
}

document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.querySelector('.add-button').addEventListener('click', attachFile);

// 책 선택 모달
function openBookSelect() {
    document.getElementById('bookSelectModal').style.display = 'block';
}

function closeBookSelect() {
    document.getElementById('bookSelectModal').style.display = 'none';
}

function selectBook() {
    closeBookSelect();
}

function openNoticeForm() {
    document.getElementById('noticeFormModal').style.display = 'block';
}

function closeNoticeForm() {
    document.getElementById('noticeFormModal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

function searchBooks() {
    const searchInput = document.getElementById('bookSearchInput').value.trim();
    const resultsContainer = document.querySelector('.book-list');
    
    if (searchInput.length <= 1) {
        resultsContainer.innerHTML = '<p>검색어를 2글자 이상 입력하세요.</p>';
        return;
    }

    resultsContainer.innerHTML = '<p>검색 중...</p>';
    
    let searchQuery = searchInput;

    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(searchQuery),
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            resultsContainer.innerHTML = '';
            
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const book = item.volumeInfo;
                    const thumbnail = book.imageLinks ? book.imageLinks.thumbnail : './images/logo.png';
                    const authors = book.authors ? book.authors.join(', ') : '저자 정보 없음';
                    
                    const bookElement = document.createElement('div');
                    bookElement.className = 'book-item';
                    bookElement.onclick = function() { selectBookItem(this); };
                    bookElement.innerHTML = `
                        <img src="${thumbnail}" alt="${book.title}">
                        <div class="book-info">
                            <h4>${book.title}</h4>
                            <p>${authors}</p>
                        </div>
                    `;
                    resultsContainer.appendChild(bookElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
            }
        },
        error: function(error) {
            console.error('책 검색 중 오류:', error);
            resultsContainer.innerHTML = '<p>검색 중 오류가 발생했습니다.</p>';
        }
    });
}

const bookSearchInput = document.getElementById('bookSearchInput');
let debounceTimer;

bookSearchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchBooks, 500);
});

let selectedBook = null;

function selectBookItem(bookElement) {
    if (selectedBook) {
        selectedBook.classList.remove('selected');
    }
    bookElement.classList.add('selected');
    selectedBook = bookElement;
}

function confirmBookSelection() {
    if (selectedBook) {
        const bookTitle = selectedBook.querySelector('h4').textContent;
        const bookAuthor = selectedBook.querySelector('p').textContent;
        const bookImage = selectedBook.querySelector('img').src;
        
        document.querySelector('.book-card h4').textContent = bookTitle;
        document.querySelector('.book-card p').textContent = bookAuthor;
        document.querySelector('.book-card .book-cover').src = bookImage;
        
        closeBookSelect();
    } else {
        alert('책을 선택해주세요.');
    }
}

function deleteNotice(element) {
    if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
        element.closest('.notice-card').remove();
    }
}

document.getElementById('noticeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('noticeTitle').value;
    const content = document.getElementById('noticeContent').value;
    const now = new Date();
    const dateString = `${now.getFullYear()}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    
    const noticeHTML = `
        <div class="notice-card">
            <button class="delete-notice" onclick="deleteNotice(this)">
                <i class="fas fa-times"></i>
            </button>
            <div class="post-header">
                <span>${title}</span>
                <div class="post-meta">
                    <img src="./images/profile.png" class="avatar">
                    <span>수연이</span>
                    <span class="date">${dateString}</span>
                </div>
            </div>
            <p>${content}</p>
        </div>
    `;
    
    document.querySelector('.notice-cards').insertAdjacentHTML('afterbegin', noticeHTML);
    closeNoticeForm();
    this.reset();
});

const voiceButton = document.getElementById('voiceButton');
const voiceControls = document.querySelector('.voice-controls');
const endCallButton = document.getElementById('endCallButton');
const toggleMicButton = document.getElementById('toggleMicButton');
let isMicOn = true;

voiceButton.addEventListener('click', function() {
    voiceButton.style.display = 'none';
    voiceControls.style.display = 'flex';
});

endCallButton.addEventListener('click', function() {
    voiceControls.style.display = 'none';
    voiceButton.style.display = 'block';
});

toggleMicButton.addEventListener('click', function() {
    isMicOn = !isMicOn;
    toggleMicButton.innerHTML = isMicOn ? 
        '<i class="fas fa-microphone"></i>' : 
        '<i class="fas fa-microphone-slash"></i>';
    toggleMicButton.classList.toggle('active');
});

document.querySelector('.join-button').addEventListener('click', function() {
    const inviteLink = 'https://booknook.com/invite/떡볶이팀';
    navigator.clipboard.writeText(inviteLink).then(() => {
        alert('초대 링크가 클립보드에 복사되었습니다.');
    });
});

function openLeaveTeamModal() {
    document.getElementById('leaveTeamModal').style.display = 'block';
}

function closeLeaveTeamModal() {
    document.getElementById('leaveTeamModal').style.display = 'none';
}

function confirmLeaveTeam() {
    window.location.href = 'my_groups.html';
}

document.querySelector('.more-button').addEventListener('click', function() {
    openLeaveTeamModal();
});

window.onclick = function(event) {
    if (event.target == document.getElementById('leaveTeamModal')) {
        closeLeaveTeamModal();
    }
}

function openEditTeamModal() {
    const modal = document.getElementById('editTeamModal');

    document.getElementById('teamName').value = document.querySelector('.book-detail h2').textContent.trim();
    document.getElementById('teamDescription').value = document.querySelector('.climate-notice').textContent;
    document.getElementById('maxMembers').value = '8'; 
    document.getElementById('meetingDate').value = document.querySelector('.info-row:nth-child(3) .value').textContent;
    
    modal.style.display = 'block';
}

function closeEditTeamModal() {
    document.getElementById('editTeamModal').style.display = 'none';
}

document.getElementById('editTeamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const teamName = document.getElementById('teamName').value;
    const teamDescription = document.getElementById('teamDescription').value;
    const maxMembers = document.getElementById('maxMembers').value;
    const meetingDate = document.getElementById('meetingDate').value;
    
    document.querySelector('.book-detail h2').textContent = teamName;
    document.querySelector('.book-detail h2').appendChild(document.createElement('button'))
        .outerHTML = '<button class="edit-team-button" onclick="openEditTeamModal()"><i class="fas fa-edit"></i></button>';
    document.querySelector('.climate-notice').textContent = teamDescription;
    document.querySelector('.info-row:nth-child(4) .value').textContent = `현재 5명 / 최대 ${maxMembers}명`;
    document.querySelector('.info-row:nth-child(3) .value').textContent = meetingDate;
    
    closeEditTeamModal();
});

document.querySelector('.edit-team-button').addEventListener('click', openEditTeamModal);