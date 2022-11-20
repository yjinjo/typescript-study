function getToken() {
  return localStorage.getItem("token");
}

async function login(event) {
  // event가 들어오게 되면, submit은 진행되려고 하는 특성이 있기 때문에 막아야 한다.
  // 즉, submit 이라는 event가 내가 진행하려고 하는 것 이외의 것들을 막아주는 것이다.
  event.preventDefault();

  // submit이라는 event가 상위로 전달되는 것을 막음
  event.stopPropagation();

  const emailElement = document.querySelector("#email");
  const passwordElement = document.querySelector("#password");

  const email = emailElement.value;
  const password = passwordElement.value;

  console.log(email, password);

  try {
    // 첫 번째 인자는 주소, 두 번째 인자는 보낼 데이터의 객체이다.
    const res = await axios.post("https://api.marktube.tv/v1/me", {
      email,
      password,
    });

    // 분해할당을 이용하여 res.data 에서 원하는 key인 token만 가져온다.
    const { token } = res.data; // const token = res.data.token;
    if (token === undefined) {
      return;
    }
    // 만약 token이 있다면 localStorage에 키-값 형태로 넣는다.
    localStorage.setItem("token", token);
    // 로그인된 상태로 인덱스 페이지가 열린다.
    // location.assign("/");
    location = "/";
  } catch (error) {
    const data = error.response.data;
    if (data) {
      const state = data.error;
      if (state === "USER_NOT_EXIST") {
        alert("사용자가 존재하지 않습니다.");
      } else if (state === "PASSWORD_NOT_MATCH") {
        alert("비밀번호가 틀렸습니다.");
      }
    }
  }
}

function bindLoginButton() {
  const form = document.querySelector("#form-login");
  // form에서 submit을 누르는 순간 login 함수가 호출되어야 한다.
  form.addEventListener("submit", login);
}

async function main() {
  // 1. 버튼에 이벤트 연결
  bindLoginButton();

  // 2. 토큰 체크: 만약 로그인 되어있는 상태라면 login 페이지에서 나가야 한다.
  const token = getToken();

  // token은 null 타입이거나 string 타입일 수 있는데, 만약 null 타입이 아니라면
  // index.html 페이지로 이동할 것이다.
  if (token !== null) {
    location.assign("/");
    return;
  }
}

// DOMContent Load가 끝나면, main 함수를 호출함
document.addEventListener("DOMContentLoaded", main);
