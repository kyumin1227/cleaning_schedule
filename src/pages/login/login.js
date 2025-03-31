// Google APIのライブラリを読み込む
function loadGoogleAuth() {
  google.accounts.id.initialize({
    client_id: "441788767782-183ndebp7adg7dsigjqofpj56bb7c3mp.apps.googleusercontent.com", // あなたのクライアントIDに変更
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(document.getElementById("google-login-btn"), {
    theme: "filled_black",
    size: "x-large",
    shape: "rectangular",
  });

  // 枠線を消す処理（要素が存在するか確認）
  setTimeout(() => {
    const signinBtn = document.querySelector(".g_id_signin");
    if (signinBtn) {
      signinBtn.style.border = "none";
      signinBtn.style.boxShadow = "none";
    }
  }, 100);

  google.accounts.id.prompt(); // 自動的にログインを促す
}

// const API_URL = "http://210.101.236.158:8081/api/login"; // APIのエンドポイント
const API_URL = "https://bannote.org/api/login";

// Google ID Tokenを使ってサーバーに認証リクエストを送信
async function handleCredentialResponse(response) {
  console.log("Google ID Token:", response.credential);

  try {
    // トークンをサーバーに送信して、認証を行う
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${response.credential}`,
      },
      body: JSON.stringify({ token: response.credential }), // トークンをJSONで送信
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log("로그인 성공하셨춥니다✨(≧◡≦)💖", data);

    // サーバーから返されたデータをセッションに保存
    sessionStorage.setItem("studentNumber", data.data.studentNumber);
    sessionStorage.setItem("familyName", data.data.familyName);
    sessionStorage.setItem("givenName", data.data.givenName);
    sessionStorage.setItem("profileImage", data.data.profileImage);
    sessionStorage.setItem("token", data.data.token);
    sessionStorage.setItem(`email`, data.data.email);
    sessionStorage.setItem(`profileImage`, data.data.profileImage);

    // ログイン成功後、メインページへ遷移
    // window.location.href = "../main_graph/graph.html";
    window.location.href = "../main/main.html";
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please try again.");
  }
}

// Google APIのスクリプトを動的に追加
(function () {
  let script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = loadGoogleAuth;
  document.head.appendChild(script);
})();
