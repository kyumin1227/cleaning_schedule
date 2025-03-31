// グローバル変数
let currentDate = new Date();

// 月を変更する関数
function changeMonth(monthChange) {
  currentDate.setMonth(currentDate.getMonth() + monthChange);
  generateCalendar();
}

// カレンダーを生成する関数
function generateCalendar() {
  const monthName = document.getElementById("month-name");
  const calendarGrid = document.getElementById("calendar-grid");

  // 月名を表示（韓国語）
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  monthName.innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // カレンダーグリッドをクリア
  calendarGrid.innerHTML = "";

  // 曜日を表示（韓国語） - 月曜始まりに変更
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

  // 曜日のヘッダーを追加
  weekdays.forEach((day) => {
    const dayCell = document.createElement("div");
    dayCell.innerText = day;
    dayCell.classList.add("week-day");
    calendarGrid.appendChild(dayCell);
  });

  // 現在の月の1日の曜日を取得
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const totalDaysInMonth = lastDateOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // 月曜始まりの調整 (日曜日を7に変更)
  const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

  // 1日の前に空白を追加
  for (let i = 0; i < adjustedFirstDayOfWeek - 1; i++) {
    const emptyCell = document.createElement("div");
    calendarGrid.appendChild(emptyCell);
  }

  // 日付を埋める
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dateCell = document.createElement("div");
    dateCell.innerText = day;
    dateCell.onclick = () => showDateDetail(day);
    calendarGrid.appendChild(dateCell);
  }
}

generateCalendar();

function showDateDetail(day) {
  const clickedDate = day;
  const clickedMonth = currentDate.getMonth() + 1;
  const clickedYear = currentDate.getFullYear();

  // 日付を2桁にパディングしてboxIdを生成
  const boxId = `${clickedYear}${String(clickedMonth).padStart(2, "0")}${String(clickedDate).padStart(2, "0")}`;

  const targetBox = document.getElementById(boxId);

  if (targetBox) {
    targetBox.scrollIntoView({ behavior: "smooth", block: "center" });
    if (targetBox) {
      targetBox.style.animation = "shake 0.5s ease-in-out";

      setTimeout(() => {
        targetBox.style.animation = "";
      }, 500);
    }
  } else {
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.innerText = "선택한 날짜에는 청소 일정이 없습니다.";
    alert("선택한 날짜에는 청소 일정이 없습니다.");
  }
}

const studentNumber = sessionStorage.getItem("studentNumber");
function showMemberScroll() {
  console.log(`クリックされた学生番号：${studentNumber}`);

  if (!studentNumber) {
    console.warn("Student number not found in sessionStorage");
    return;
  }

  const targetElements = document.querySelectorAll(`[data-student-number="${studentNumber}"]`);

  if (targetElements.length > 0) {
    targetElements[0].scrollIntoView({ behavior: "smooth", block: "center" });
    targetElements.forEach((targetElement) => {
      const boxElement = targetElement.closest(".box");
      if (boxElement) {
        boxElement.style.animation = "shake 0.5s ease-in-out";

        setTimeout(() => {
          boxElement.style.animation = "";
        }, 500);
      }
    });
  } else {
    console.warn("No matching element found for student number:", studentNumber);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const calendarBtn = document.querySelector(".calender-btn button");
  const calendarSearch = document.querySelector(".calendar_serch");

  calendarBtn.addEventListener("click", function () {
    if (calendarSearch.style.height === "0px" || calendarSearch.style.height === "") {
      // 本来の高さを取得
      calendarSearch.style.height = calendarSearch.scrollHeight + "px";
    } else {
      calendarSearch.style.height = "0px";
    }
  });
  ////////////////////////////////////////////////////////////////
  /////box表示
  async function fetchData() {
    try {
      const response = await fetch("https://bannote.org/api/clean/all?classId=1");
      const data = await response.json();
      console.log("取得したデータ:", data.data);

      if (!Array.isArray(data.data) || data.data.length === 0) {
        console.error("データが空です。");
        return;
      }

      setProfileImages(data.data);

      const boxList = document.querySelector(`.box-list`);
      let currentDate = ``;
      let box = null; // 現在のボックスを保持する変数

      data.data.forEach((item) => {
        const date = new Date(item.date);
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${
          dayNames[date.getDay()]
        }요일`;

        // 日付が変わったら新しいボックスを作成
        if (formattedDate !== currentDate) {
          currentDate = formattedDate;
          box = document.createElement("div");
          box.classList.add("box");
          box.id = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}`;

          const dateElement = document.createElement("div");
          dateElement.classList.add("date");
          dateElement.innerHTML = `<h5>${formattedDate}</h5>`;
          box.appendChild(dateElement);
          boxList.appendChild(box);
        }

        const members = (item) => {
          let addNuguCount = item.membersCount - item.members.length;
          const addNugu = `
                    <div class="member" data-group-id=${item.groupId} >
                        <div class="mem-img mem-x">
                            <img src="http://127.0.0.1:5501/img/plus.png" />
                        </div>
                        <div class="mem-name">
                            <h6>추가</h6>
                        </div>    
                        <!-- 吹き出しメニュー -->
                        <div class="add_menu" style="display: none;">
                            <div class=menu_batu><i class="fa-solid fa-xmark" style="color :rgb(180, 180, 180)"></i></div>
                            <div class="add-img">
                                <img src="https://furiirakun.com/wp/wp-content/uploads/2023/01/kaitensurutori.gif" alt="add-user-male"/>
                            </div>    
                            <div class="add-title">
                                <h4>추가 신청</h4> <!-- 追加する学生を選択 -->
                            </div>
                            <div class="add-data">
                                <p>${formattedDate}</p>
                            </div>
                            <div class="add_cleanArea">
                                <p>${item.cleanArea}</p>
                            </div>
                            <div class="add-input">
                                <div class="schoolNumber">
                                    <img src="https://img.icons8.com/pulsar-color/48/graduation-cap.png" alt="graduation-cap"/>
                                    <input type="text" placeholder="학번을 입력하세요">
                                </div>
                                <div class="add-btn">
                                    <div class="add-btn_cancel">
                                        <button>취소</button>
                                    </div>
                                    <div class="add-btn_OK">
                                        <button class="add_OK">학인</button>
                                    </div>
                                </div>
                            </div>
                        </div>                
                    </div>
                    `;

          let membersHtml = item.members
            .map((member) => {
              const date = new Date(item.date);
              const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${
                dayNames[date.getDay()]
              }요일`;

              return `
                        <div class="member" data-group-id=${item.groupId} data-student-number=${member.studentNumber}>
                            <div class="mem-img mem-o" id=${member.studentNumber}>
                                <img class="mem-o_img" src="${member.profileImage}" />
                                <div class="clean-coun">
                                    <p>${member.cleaningCount}</p>
                                </div>
                            </div>
                            <div class="mem-name">
                                <h6>${member.familyName} ${member.givenName}</h6>
                            </div>
                            <!-- 吹き出しメニュー -->
                            <div class="member-menu">
                                <div class=menu_batu><i class="fa-solid fa-xmark" style="color :rgb(180, 180, 180)"></i></div>
                                <div class="member-info">
                                    <img src="${member.profileImage}" alt="Member Image">
                                    <h6>${member.familyName} ${member.givenName}</h6>
                                    <p>${formattedDate}</p>
                                </div>
                                <div class="mem-menu">
                                    <div class="mem-menu_img">
                                        <img src="https://img.icons8.com/pulsar-color/48/user-female-circle.png" alt="user-female-circle"/>
                                    </div>
                                    <div class="mem-menu_p">
                                        <p>프로필 보기</p>
                                    </div>
                                </div>
                                <div class="mem-menu">
                                    <div class="mem-menu_img">
                                        <img src="https://img.icons8.com/pulsar-color/48/broom.png" alt="broom"/>
                                    </div>
                                    <div class="mem-menu_p">
                                        <p>청소 기록</p>
                                    </div>
                                </div>
                                <div class="mem-menu">
                                    <div class="mem-menu_img">
                                        <img src="https://img.icons8.com/pulsar-color/48/change.png" alt="change"/>
                                    </div>
                                    <div class="mem-menu_p">
                                        <p>교환 신청</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
            })
            .join("");

          membersHtml += addNugu.repeat(addNuguCount);
          return membersHtml;
        };

        let addNuguCount = item.membersCount - item.members.length;

        if (box) {
          const areaSub = document.createElement("div");
          areaSub.classList.add("area-sub");
          areaSub.innerHTML = `
                        <div class="all-sw">
                            <div class="area-menu">
                                <div class="area me-box">
                                    <h6>${item.cleanArea}</h6>
                                </div>
                                <div class="mem-coun me-box">
                                    <h6>${item.membersCount}</h6>
                                </div>
                            </div>
                            <!-- <div class="me-box me-edit">
                                <div class="card">
                                    <div class="front">
                                        <h6><img src="http://127.0.0.1:5501/img/pen.png" alt="pen icon"></h6>
                                    </div>
                                    <div class="back">
                                        <h6>EDIT</h6>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                        <div class="members">
                            ${members(item)}
                        </div>
                    `;
          box.appendChild(areaSub);
        }
      });

      // 吹き出しメニューの表示/非表示を共通化
      function toggleMenu(event, menuClass) {
        const member = event.target.closest(".member");
        const menu = member.querySelector(menuClass);

        if (menu.style.display === "none" || menu.style.display === "") {
          menu.style.display = "block";
          setTimeout(() => {
            menu.classList.add("show");
          }, 10);
        } else {
          menu.classList.remove("show");
          setTimeout(() => {
            menu.style.display = "none";
          }, 300);
        }
      }

      // メンバー画像クリック時に吹き出しメニューを表示
      document.querySelectorAll(".mem-img.mem-o").forEach((memImg) => {
        memImg.addEventListener("click", (event) => {
          console.log("イメージがクリックされました。");
          toggleMenu(event, ".member-menu");
        });
      });

      // "mem-img mem-x" ボタンがクリックされたときにadd-menuを表示
      document.querySelectorAll(".mem-img.mem-x").forEach((memImg) => {
        memImg.addEventListener("click", (event) => {
          console.log("mem-xがクリックされました。");
          toggleMenu(event, ".add_menu");
        });
      });

      // メニューを閉じる処理を共通化
      function closeMenu() {
        document.querySelectorAll(".add_menu, .member-menu").forEach((menu) => {
          menu.classList.remove("show");
          setTimeout(() => {
            menu.style.display = "none";
          }, 300);
        });
      }

      // バツ印を押したときの処理
      document.addEventListener("click", (event) => {
        // .menu_batu がクリックされたか確認
        if (event.target.closest(".menu_batu")) {
          console.log("click : X"); // バツ印がクリックされた時
          closeMenu(); // メニューを閉じる
        }

        // 外側をクリックしたときの処理
        const isMenuClick = event.target.closest(".add_menu") || event.target.closest(".member-menu");
        const isMemImgClick = event.target.closest(".mem-img.mem-x") || event.target.closest(".mem-img.mem-o");

        // メニューまたはメンバー画像がクリックされていない場合にメニューを閉じる
        if (!isMenuClick && !isMemImgClick) {
          closeMenu();
        }
      });
    } catch (error) {
      console.error("データ取得に失敗しました:", error);
    }
  }

  fetchData();

  function setProfileImages(data) {
    // 使用済みの画像IDを管理するためのセット
    let usedImages = new Set();

    // ローカルストレージから画像の割り当てを読み込み
    let storedImages = JSON.parse(localStorage.getItem("profileImages")) || {};

    data.forEach((group) => {
      group.members.forEach((member) => {
        if (member.profileImage === null) {
          // すでにローカルストレージに保存されている画像IDがあればそれを使う
          if (storedImages[member.studentNumber]) {
            member.profileImage = storedImages[member.studentNumber];
          } else {
            let randomImageId;

            // まだ使用されていない画像IDをランダムに選ぶ
            do {
              randomImageId = `im${String(Math.floor(Math.random() * 40) + 1).padStart(2, "0")}`; // 01~40まで
            } while (usedImages.has(randomImageId)); // 重複しないように確認

            // 画像IDをセットに追加して、次回の選択で使わないようにする
            usedImages.add(randomImageId);

            // 画像URLを設定
            member.profileImage = `https://raw.githubusercontent.com/Saaatsuki/cleaning_schedule/main/img/profile/${randomImageId}.png`;

            // ローカルストレージに保存
            storedImages[member.studentNumber] = member.profileImage;
            localStorage.setItem("profileImages", JSON.stringify(storedImages));
          }

          const img = new Image();
          img.onload = () => {
            console.log("画像が正常に読み込まれました:", img.src);
          };
          img.onerror = () => {
            console.error("画像読み込みエラー:", img.src);
            // 画像が読み込めなかった場合は、デフォルト画像を使用
            member.profileImage = "https://www.sanrio.co.jp/wp-content/uploads/2022/06/list-hellokitty.png";
          };
          img.src = member.profileImage;
        }
      });
    });
  }
  /////////↑Box表示////////////////////////////////////////////////////////////////
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const studentNumber = await getStudentNumber();
    console.log("Student number:", studentNumber);

    if (studentNumber) {
      const elements = await getElements(studentNumber);
      console.log("Found elements:", elements);

      // 各要素に対して処理を行う
      for (const element of elements) {
        const imgElement = element.querySelector(".mem-o_img");
        console.log("Found img element:", imgElement); // 見つかったimg要素の確認

        if (imgElement) {
          imgElement.classList.add("glow-animation");
          console.log("Glow animation added");
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// 擬似的に非同期処理にする関数
function getStudentNumber() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const studentNumber = sessionStorage.getItem("studentNumber");
      if (studentNumber) {
        resolve(studentNumber);
      } else {
        reject("Student number not found in sessionStorage");
      }
    }, 1000); // 1秒後に取得
  });
}

function getElements(studentNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const elements = document.querySelectorAll(`[data-student-number="${studentNumber}"]`);
      if (elements.length > 0) {
        resolve(elements);
      } else {
        reject("No matching elements found");
      }
    }, 1000); // 1秒後に取得
  });
}
