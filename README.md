# 별탄 · BYEOLTAN

빌드 도구 없이 실행되는 HTML / CSS / JavaScript 개인 홈페이지입니다. dist/가 배포 파일입니다. START 버튼 또는 Enter 키로 타이틀에서 게임 로비에 입장합니다. 로비는 데스크톱 한 화면, 모바일은 캐릭터 아래 메뉴를 배치합니다. HOME / GALLERY / LOG / CALENDAR / PROFILE은 해시 경로와 브라우저 뒤로 가기를 지원합니다.

## 실행

프로젝트 폴더에서 python -m http.server 4173 --directory dist 실행 후 http://localhost:4173 으로 접속합니다. JavaScript 모듈을 사용하므로 파일 더블클릭 대신 HTTP 서버를 사용하세요.

## 캐릭터 구조

character/CharacterActor.js는 IDLE, LOOK, HAPPY, SURPRISED, BOUNCE, TALK, SLEEP 상태 및 마우스 추적을 담당합니다. 클릭하면 이전 반응을 정리하고 새로운 동작과 대사를 표시합니다. 45초 동안 입력이 없으면 잠들고 입력 시 깨어납니다. CharacterRenderer.js는 원본 SVG 전체의 위치·기울기·크기와 그림자, 배경 패럴랙스만 변경합니다. 얼굴이나 관절을 임의로 분리하지 않습니다.

캐릭터 이미지 경로는 index.html의 #character-image입니다. PNG로 교체할 수 있으며, 추후 Live2D/Rive/파츠 렌더러는 render(pose,state), reset(), dispose() 인터페이스를 구현해 교체합니다. 대사는 character/dialogues.js, 타이핑과 파티클은 별도 모듈입니다.

설정에서 모션과 배경음, 음량을 조절합니다. 기기의 모션 감소 설정도 존중합니다. BGM은 사용자가 켠 뒤 재생하는 자체 Web Audio 멜로디입니다. 페이지 비활성 시 캐릭터 루프를 정지하고 종료 시 RAF, 이벤트와 타이머를 해제합니다.

## 콘텐츠와 에셋

content.js의 artworks, logs, events는 교체용 예시 데이터입니다. 그림 4개는 기존 SVG placeholder이며 작가의 실제 작품이 아닙니다. 헤더는 이미지 로고만 사용합니다. 기존 도마뱀 SVG와 생성한 픽셀 마을 배경을 재사용합니다. 레퍼런스는 비대칭 게임 메뉴와 타이포그래피 방향에만 참고했습니다.

Galmuri11 폰트 라이선스는 dist/assets/FONT-LICENSE.txt에 있습니다. .openai/hosting.json은 기존 사이트 연결을 유지하므로 project_id를 바꾸지 마세요.

## 이미지 추가 위치
- `dist/assets/references/`: HOME 및 GALLERY 디자인 참고 이미지 (사이트에 직접 표시하지 않음)
- `dist/assets/gallery/`: 추후 업로드할 실제 일러스트
- `dist/assets/calendar/`: 추후 업로드할 캘린더 배경
- `dist/assets/links/`: 추후 업로드할 외부 홈페이지 배너

현재 비어 있는 폴더의 `.gitkeep`은 폴더 구조 유지를 위한 파일입니다. 이미지가 추가되면 삭제해도 됩니다.

이 배포용 정리본에는 이전 Git 이력(`.git/`)이 포함되지 않습니다. 원본 ZIP은 별도로 보관하세요.
