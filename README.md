# 상사 피하기 게임

위에서 내려오는 상사를 좌우로 피하는 간단한 웹 게임입니다.  
상사와 충돌하면 게임이 종료되고, 잔소리 이미지가 표시됩니다.

## 플레이 방법

- 이동: `←` `→` 또는 `A` `D`
- 모바일/마우스: 화면 하단 `◀`, `▶` 버튼
- 재시작: 하단 `다시 시작` 버튼 또는 게임오버 화면의 `다시 도전` 버튼

## 스크린샷
<table>
  <tr>
    <td><img width="609" height="925" alt="Screenshot 2026-02-25 at 11 37 37 PM" src="https://github.com/user-attachments/assets/519c3532-ee72-485f-a57d-c0daa3c921a9" /></td>
    <td><img width="575" height="930" alt="Screenshot 2026-02-25 at 11 37 28 PM" src="https://github.com/user-attachments/assets/7ef02da2-ba43-411e-b847-674b9e979498" /></td>
  </tr>
</table>

## 게임 규칙

- 상사는 위에서 아래로 계속 내려옵니다.
- 시간이 지날수록 내려오는 속도가 조금씩 빨라집니다.
- 상사가 화면 아래로 지나가면 점수가 1점 올라갑니다.
- 상사와 충돌하면 게임오버입니다.

## 실행 방법

### 1) 파일로 바로 실행

`index.html`을 브라우저에서 열면 바로 플레이할 수 있습니다.

### 2) 로컬 서버로 실행 (권장)

프로젝트 루트에서 아래 명령 실행:

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

## 파일 구조

```text
.
├─ index.html
├─ styles.css
├─ src/
│  └─ main.js
└─ assets/
   ├─ player.svg
   ├─ boss.svg
   └─ scolding.svg
```

## 커스터마이징 포인트

- 게임 속도/난이도: `src/main.js`
  - `PLAYER_SPEED`
  - `BASE_BOSS_SPEED`
  - `SPAWN_MIN_MS`, `SPAWN_MAX_MS`
- 화면 스타일: `styles.css`
- 캐릭터/엔딩 이미지: `assets/*.svg`
