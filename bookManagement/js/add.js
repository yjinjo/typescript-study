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

async function save(event) {
  // 원래 html의 submit이 가지고 있는 form을 정지시킴
  event.preventDefault();
  // form을 가지고 있는 상위 DOM에도 전달되지 않도록 함.
  event.stopPropagation();

  // bootstrap에 있는 기능인데, 값이 하나라도 추가되지 않으면 UI적으로 표시해준다.
  event.target.classList.add("was-validated");

  const titleElement = document.querySelector("#title");
  const messageElement = document.querySelector("#message");
  const authorElement = document.querySelector("#author");
  const urlElement = document.querySelector("#url");

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  // 기본적인 유효성 검사는 client에서도 해줘야 한다.
  // 만약 하나라도 빈칸이면 멈춰야한다.
  if (title === "" || message === "" || author === "" || url === "") {
    return;
  }

  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return;
  }

  try {
    await axios.post(
      "https://api.marktube.tv/v1/book",
      {
        title,
        message,
        author,
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    location.assign("/");
  } catch (error) {
    console.log("save error", error);
    alert("책 추가 실패");
  }
}

function bindSaveButton() {
  const form = document.querySelector("#form-add-book");
  form.addEventListener("submit", save);
}

async function main() {
  // 1. 버튼에 이벤트 연결
  bindSaveButton();

  // 2. 토큰 체크
  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return;
  }

  // 3. 토큰으로 서버에서 나의 정보 받아오기
  // 토큰이 유효한지 체크하기 위해서이기도 하다.
  const user = await getUserByToken(token);
  if (user === null) {
    // token을 가져왔을 때 null이면 localStorage가 문제가 있는 것이므로 clear 해줌
    localStorage.clear();
    // 다시 로그인 할 수 있도록 페이지 유도
    location.assign("/login");
    return;
  }

  console.log(user);
}

document.addEventListener("DOMContentLoaded", main);
