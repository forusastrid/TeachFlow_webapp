function showTab(id, menuEl = null, tabEl = null) {
  document.querySelectorAll('.widgets').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (!target) {
    console.error(`showTab: ID '${id}'에 해당하는 요소를 찾을 수 없습니다.`);
    return;
  }
  target.style.display = 'grid';
  setTimeout(() => target.classList.add('active'), 10);

  if (menuEl) {
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    menuEl.classList.add('active');
  }
  if (tabEl) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
  }
}

let calendar = null;
function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('initCalendar: ID "calendar"에 해당하는 요소를 찾을 수 없습니다.');
    return;
  }
  if (calendar !== null) {
    calendar.destroy();
  }
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek'
    },
    height: 500,
    events: [
      { title: '수학', start: '2025-07-15T09:00:00', end: '2025-07-15T10:00:00', color: '#2c7be5' },
      { title: '과학', start: '2025-07-15T10:15:00', end: '2025-07-15T11:15:00', color: '#1a4db7' },
      { title: '영어', start: '2025-07-16T13:00:00', end: '2025-07-16T14:00:00', color: '#4a90e2' }
    ]
  });
  calendar.render();
}

const equipmentData = [
  { name: '노트북', reserved: true },
  { name: '갤럭시 패드', reserved: false },
  { name: '갤럭시 S25 울트라', reserved: false },
  { name: 'LG 스텐바이미 GO', reserved: false },
  { name: '모니터', reserved: false },
  { name: '라즈베리파이5', reserved: false },
  { name: '메타퀘스트2', reserved: false }
];

function renderEquipment() {
  const tbody = document.getElementById('equipmentList');
  if (!tbody) {
    console.error('renderEquipment: ID "equipmentList"에 해당하는 요소를 찾을 수 없습니다.');
    return;
  }
  tbody.innerHTML = '';
  equipmentData.forEach((eq, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${eq.name}</td>
      <td>${eq.reserved ? '<span style="color:red;">예약됨</span>' : '사용 가능'}</td>
      <td><button ${eq.reserved ? 'disabled' : ''} onclick="reserveEquipment(${i})">예약하기</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function reserveEquipment(i) {
  if (equipmentData[i].reserved) {
    alert('이미 예약된 장비입니다.');
  } else {
    equipmentData[i].reserved = true;
    alert(`${equipmentData[i].name} 예약 완료!`);
    renderEquipment();
  }
}

function getRoomReservations() {
  const data = localStorage.getItem('roomReservations');
  return data ? JSON.parse(data) : [];
}

function saveRoomReservations(reservations) {
  localStorage.setItem('roomReservations', JSON.stringify(reservations));
}

function reserveRoom() {
  const room = document.getElementById('roomSelect').value;
  const time = document.getElementById('timeSelect').value;
  if (!time) {
    alert('예약 시간을 선택하세요.');
    return;
  }
  const reservations = getRoomReservations();
  const conflict = reservations.find(r => r.room === room && r.time === time);
  if (conflict) {
    alert('이미 해당 시간에 예약된 방입니다.');
    return;
  }
  reservations.push({ room, time });
  saveRoomReservations(reservations);
  document.getElementById('roomReservationMsg').textContent = `${room}이(가) ${time}에 예약되었습니다.`;
  document.getElementById('timeSelect').value = '';
}

const mealMenus = {
  '2025-07-15': '볶음밥, 미역국, 김치, 계란찜, 과일',
  '2025-07-16': '카레라이스, 콩나물국, 오징어볶음, 깍두기, 요구르트',
  '2025-07-17': '잡채밥, 북어국, 두부조림, 나물무침, 바나나'
};

function loadMealMenu() {
  const el = document.getElementById('mealMenu');
  if (!el) {
    console.error('loadMealMenu: ID "mealMenu"에 해당하는 요소를 찾을 수 없습니다.');
    return;
  }

  const today = new Date();
  const dates = [
    today.toISOString().slice(0, 10),
    new Date(today.getTime() + 86400000).toISOString().slice(0, 10), // 내일
    new Date(today.getTime() + 2 * 86400000).toISOString().slice(0, 10) // 모레
  ];

  const menus = dates.map(date => {
    return `<strong>${date}</strong>: ${mealMenus[date] || '급식 메뉴가 없습니다.'}`;
  });

  el.innerHTML = menus.join('<br>');
}

function initCharts() {
  const ctxBar = document.getElementById('attendanceChart')?.getContext('2d');
  if (!ctxBar) {
    console.error('initCharts: ID "attendanceChart"에 해당하는 요소를 찾을 수 없습니다.');
    return;
  }

  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['3월', '4월', '5월', '6월', '7월'],
      datasets: [
        {
          label: '출석률 (%)',
          data: [95, 94, 96, 93, 97],
          backgroundColor: [
            'rgba(44, 123, 229, 0.7)',
            'rgba(44, 123, 229, 0.7)',
            'rgba(44, 123, 229, 0.7)',
            'rgba(44, 123, 229, 0.7)',
            'rgba(44, 123, 229, 0.7)'
          ],
          borderColor: 'rgba(44, 123, 229, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#333'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
            color: '#333'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)'
          }
        }
      }
    }
  });

  const ctxLine = document.getElementById('attendanceLineChart')?.getContext('2d');
  if (!ctxLine) {
    console.error('initCharts: ID "attendanceLineChart"에 해당하는 요소를 찾을 수 없습니다.');
    return;
  }

  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ['3월', '4월', '5월', '6월', '7월'],
      datasets: [
        {
          label: '출석률 (%)',
          data: [95, 94, 96, 93, 97],
          borderColor: 'rgba(44, 123, 229, 1)',
          backgroundColor: 'rgba(44, 123, 229, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(44, 123, 229, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#333'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
            color: '#333'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)'
          }
        }
      }
    }
  });
}

async function askChatbot() {
  const input = document.getElementById('chatInput');
  const chatWindow = document.getElementById('chatWindow');
  const question = input.value.trim();
  if (!question) return alert('질문을 입력하세요.');

  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user');
  userMsg.textContent = question;
  chatWindow.appendChild(userMsg);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  const predefinedAnswers = {
    '시간표': '전자 시간표 탭에서 일정을 확인하세요.',
    '급식': '급식 알리미 탭에서 오늘 급식 메뉴를 확인하세요.',
    '예약': '기기/장비 예약 탭에서 예약 가능합니다.',
    '출석률': '차트 탭에서 출석률을 확인할 수 있습니다.'
  };

  let answer = predefinedAnswers[Object.keys(predefinedAnswers).find(key => question.includes(key))];

  if (!answer) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `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` // OpenAI API 키를 여기에 입력하세요
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: '너는 천안월봉고 체계화 시스템의 AI 채팅봇이다. 학생과 교사의 질문에 대해 답변을 제공해야 한다.' },
            { role: 'user', content: question }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      answer = data.choices[0].message.content.trim() || '죄송합니다. 정확한 답변을 찾을 수 없습니다.';
    } catch (error) {
      console.error('askChatbot: GPT API 호출 중 오류 발생', error);
      answer = '죄송합니다. 현재 답변을 제공할 수 없습니다.';
    }
  }

  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot');
  botMsg.textContent = answer;
  chatWindow.appendChild(botMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  input.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
  showTab('teacherCall');
  renderEquipment();
  initCalendar();
  loadMealMenu();
  initCharts();
});