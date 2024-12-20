// 전역 변수
let books = [];
let currentPage = 0;
const BOOKS_PER_PAGE = 4;
let totalReadingTime = 100;

function searchBooks(query) {
    const resultsContainer = document.getElementById('book-search-results');
    resultsContainer.innerHTML = '<p>검색 중...</p>';

    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(query),
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            resultsContainer.innerHTML = '';
            
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const book = item.volumeInfo;
                    const thumbnail = book.imageLinks ? book.imageLinks.thumbnail : './images/logo.png';
                    const authors = book.authors ? book.authors.join(', ') : '저자 정보 없음';
                    
                    const bookResult = document.createElement('div');
                    bookResult.className = 'book-result';
                    bookResult.innerHTML = `
                        <img src="${thumbnail}" alt="책 표지" class="book-thumbnail" 
                             style="width: 50px; height: 70px; object-fit: cover;">
                        <div class="book-info">
                            <span class="book-title">${book.title}</span>
                            <span class="book-author">${authors}</span>
                            <span class="book-publisher">${book.publisher || '출판사 정보 없음'}</span>
                        </div>
                        <button class="add-book-btn">추가</button>
                    `;

                    const addButton = bookResult.querySelector('.add-book-btn');
                    addButton.addEventListener('click', function() {
                        const newBook = {
                            id: Date.now(),
                            title: book.title,
                            author: authors,
                            cover: thumbnail,
                            status: "읽는 중",
                            readTime: 0,
                            isVisible: true,
                            isbn: book.industryIdentifiers ? 
                                  book.industryIdentifiers[0].identifier : ''
                        };
                        
                        addBookToLibrary(newBook);
                    });

                    resultsContainer.appendChild(bookResult);
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

function updateReadBooksCount() {
    const readBooksCountElement = document.querySelector('.stats-grid .stat-item:nth-child(2) .stat-value');
    if (readBooksCountElement) {
        readBooksCountElement.textContent = books.length;
    }
}

// 새로운 책 추가 함수
function addBookToLibrary(newBook) {

    const isDuplicate = books.some(book => 
        book.isbn === newBook.isbn || 
        (book.title === newBook.title && book.author === newBook.author)
    );

    if (isDuplicate) {
        alert('이미 추가된 책입니다.');
        return;
    }

    books.push(newBook);
    updateReadBooksCount();
    renderBooks();
    closeAddBookModal();
}

// 책장 검색 함수
function filterBooks(searchTerm) {
    const filteredBooks = searchTerm ? 
        books.filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) :
        books;
    
    currentPage = 0;
    renderBooks(filteredBooks);
}

function updateTotalReadingTime(additionalTime) {
    totalReadingTime += parseInt(additionalTime);
    const readTimeElement = document.querySelector('.stats-grid .stat-item:nth-child(1) .stat-value');
    if (readTimeElement) {
        readTimeElement.textContent = totalReadingTime;
    }
}

function openBookStatusModal(bookId) {
    const modal = document.getElementById('book-status-modal');
    const book = books.find(b => b.id === bookId);
    
    if (!modal || !book) return;

    const statusInputs = modal.querySelectorAll('input[name="book-status"]');
    statusInputs.forEach(input => {
        input.checked = input.value === book.status;
    });

    // 읽은 시간 설정
    const timeInput = document.getElementById('reading-time-input');
    timeInput.value = book.readTime || 0;

    // 저장 버튼 이벤트
    const saveButton = document.getElementById('save-status');
    saveButton.onclick = () => {
        const newStatus = modal.querySelector('input[name="book-status"]:checked').value;
        const newTime = parseInt(timeInput.value) || 0;
        const additionalTime = newTime - (book.readTime || 0);
        
        book.status = newStatus;
        book.readTime = newTime;
        
        updateTotalReadingTime(additionalTime);
        renderBooks();
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

function renderBooks(booksToRender = books) {
    const booksGrid = document.querySelector('.books-grid');
    if (!booksGrid) return;

    const start = currentPage * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    const currentBooks = booksToRender.slice(start, end);
    
    booksGrid.innerHTML = '';
    currentBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-item';
        bookElement.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-status">${book.status || '상태 없음'}</div>
            ${book.readTime ? `<div class="read-time">읽은 시간: ${book.readTime}</div>` : ''}
        `;
        
        bookElement.addEventListener('click', () => openBookStatusModal(book.id));
        booksGrid.appendChild(bookElement);
    });

    updatePaginationState(booksToRender.length);
}

// 페이지네이션 상태 업데이트
function updatePaginationState(totalBooks) {
    const viewToggle = document.querySelector('.view-toggle');
    if (viewToggle) {
        viewToggle.style.display = totalBooks > BOOKS_PER_PAGE ? 'block' : 'none';
    }
}

// 페이지 전환 함수
function togglePage() {
    const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
    currentPage = (currentPage + 1) % totalPages;
    renderBooks();
}

// 모달 관련 함수들
function closeAddBookModal() {
    const modal = document.getElementById('add-book-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openAddBookModal() {
    const modal = document.getElementById('add-book-modal');
    const searchInput = document.getElementById('book-search-input');
    const resultsContainer = document.getElementById('book-search-results');

    if (!modal || !searchInput || !resultsContainer) {
        console.error('필요한 요소를 찾을 수 없습니다.');
        return;
    }

    resultsContainer.innerHTML = '';
    searchInput.value = '';

    const oldSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(oldSearchInput, searchInput);

    let debounceTimer;
    oldSearchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length > 1) {
            debounceTimer = setTimeout(() => {
                searchBooks(query);
            }, 500);
        } else {
            resultsContainer.innerHTML = '';
        }
    });

    modal.style.display = 'block';
}

function initializeLibrary() {
    const addButton = document.querySelector('.add-book');
    if (addButton) {
        addButton.addEventListener('click', openAddBookModal);
    }
    
    const searchInput = document.querySelector('.search-controls input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterBooks(e.target.value.trim());
        });
    }

    const viewToggle = document.querySelector('.view-toggle');
    if (viewToggle) {
        viewToggle.addEventListener('click', togglePage);
    }
    
    renderBooks();
}

const style = document.createElement('style');
style.textContent = `
    .book-result {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
        gap: 15px;
    }

    .book-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .book-thumbnail {
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .book-title {
        font-weight: bold;
    }

    .book-author, .book-publisher {
        font-size: 0.9em;
        color: #666;
    }

    .add-book-btn {
        padding: 5px 15px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .add-book-btn:hover {
        background-color: #0056b3;
    }

    .books-grid {
        display: flex;
        gap: 20px;
        overflow: hidden;
    }

    .book-item {
        flex: 0 0 auto;
        width: calc(25% - 15px);
    }
`;

document.head.appendChild(style);

const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .left-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #fff;
        min-width: 160px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        z-index: 1;
    }

    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {
        background-color: #f1f1f1;
    }

    .book-item {
        cursor: pointer;
        transition: transform 0.2s;
    }

    .book-item:hover {
        transform: translateY(-5px);
    }

    #book-status-modal .modal-content {
        padding: 20px;
    }

    .status-options {
        margin: 20px 0;
    }

    .reading-time {
        margin: 20px 0;
    }

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
`;

document.head.appendChild(additionalStyle);

document.addEventListener('DOMContentLoaded', initializeLibrary);