function getToken() {
  return localStorage.getItem("token");
}

async function getUserByToken(token) {
  try {
    // token을 서버에서 계산해서 확인한 다음 문제가 없다면 token 값을 가지고 있는
    // user의 정보를 내려준다.
    const res = await axios.get("https://api.marktube.tv/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // 문제가 없다면 user의 정보를 내려준다.
  } catch (error) {
    console.log("getUserByToken error", error);
    return null;
  }
}

async function logout() {
  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return;
  }
  try {
    await axios.delete("https://api.marktube.tv/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("logout error", error);
  } finally {
    localStorage.clear();
    location.assign("/login");
  }
}

function bindLogoutButton() {
  const btnLogout = document.querySelector("#btn_logout");
  btnLogout.addEventListener("click", logout);
}

async function getBook() {
  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return null;
  }
  try {
    const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
      headers: {
        AUthorization: `Baarer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("getBook error", error);
    return null;
  }
}

async function deleteBook(bookId) {
  const token = getToken();
  if (token === null) {
    lcoation = "/login";
    return;
  }

  await axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function render(book) {
  const detailElement = document.querySelector("#detail");

  detailElement.innerHTML = `<div class="card bg-light w-100">
    <div class="card-header"><h4>${book.title}</h4></div>
    <div class="card-body">
      <h5 class="card-title">"${book.message}"</h5>
      <p class="card-text">글쓴이 : ${book.author}</p>
      <p class="card-text">링크 : <a href="${
        book.url
      }" target="_BLANK">바로 가기</a></p>
      <a href="/edit?id=${book.bookId}" class="btn btn-primary btn-sm">Edit</a>
      <button type="button" class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
    </div>
    <div class="card-footer">
        <small class="text-muted">작성일 : ${new Date(
          book.createdAt
        ).toLocaleString()}</small>
      </div>
  </div>`;

  document.querySelector("#btn-delete").addEventListener("click", async () => {
    try {
      await deleteBook(book.bookId);
      location.href = "/";
    } catch (error) {
      console.log(error);
    }
  });
}

async function main() {
  // 1. 버튼에 이벤트 연결
  bindLogoutButton();

  // 2. 브라우저에서 id 가져오기
  const bookId = new URL(location.href).searchParamas.get("id");

  // 3. 토큰 체크
  const token = getToken();
  if (token === null) {
    location.href = "/login";
    return;
  }

  // 4. 토큰으로 서버에서 나의 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.href = "/login";
    return;
  }

  // 5. 책을 서버에서 받아오기
  const book = await getBook(bookId);
  if (book === null) {
    alert("서버에서 책 가져오기 실패");
    return;
  }

  // 6. 받아온 책을 그리기
  render(book);
}

document.addEventListener("DOMContentLoaded", main);
