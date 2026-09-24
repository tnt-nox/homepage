// Add or change dialogue here without touching the actor or renderer.
export const dialogues={
 HAPPY:['헤헤, 반가워!','오늘도 좋은 하루!'],
 SURPRISED:['으악! 깜짝이야!','꼬리는 만지지 마!'],
 BOUNCE:['같이 폴짝!','어서 와! 오늘은 뭐 하고 놀까?'],
 TALK:['내 그림 구경할래?','갤러리에 새 그림이 있을지도?','오늘도 무언가 그리고 있어.'],
 SLEEP:['잠깐만… 눈 좀 붙일게.'],
 WELCOME:['어서 와! 오늘은 뭐 하고 놀까?']
};
export function chooseDialogue(state,random=Math.random){const list=dialogues[state]||dialogues.TALK;return list[Math.floor(random()*list.length)]}
