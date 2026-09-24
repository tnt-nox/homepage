import {mountContent} from './content.js';
import {CharacterActor} from './character/CharacterActor.js';
import {CharacterRenderer} from './character/CharacterRenderer.js';
import {CharacterDialogue} from './character/CharacterDialogue.js';
import {CharacterParticles} from './character/CharacterParticles.js';
import {GameTransition} from './GameTransition.js';
import {LobbyAudio} from './LobbyAudio.js';

const $=selector=>document.querySelector(selector);
const media=matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled=true;
try{motionEnabled=localStorage.getItem('byeoltan-motion')!=='off'}catch{}
const reduced=()=>media.matches||!motionEnabled;
const events=new AbortController();const on=(target,event,fn,options={})=>target.addEventListener(event,fn,{...options,signal:events.signal});
const {dialog:detail}=mountContent();
const renderer=new CharacterRenderer({visual:$('#character-visual'),button:$('#character'),shadow:$('#actor-shadow'),sleep:$('#sleep-mark'),parallax:[...document.querySelectorAll('[data-parallax]')]});
const dialogue=new CharacterDialogue({root:$('#character-dialogue'),text:$('#dialogue-text'),announcement:$('#dialogue-announcement'),reduced});
const particles=new CharacterParticles($('#character-particles'),reduced);
const actor=new CharacterActor({renderer,dialogue,particles,reduced});
const transition=new GameTransition($('#game-transition'),$('#transition-label'),reduced);
let route='home',started=false,starting=false,toastTimer=0,menuTimer=0;
const routes=['home','gallery','log','calendar','profile','banner'];
function parsedRoute(){const hash=location.hash.slice(1);return routes.includes(hash)?hash:'home'}
function revealPage(next,focus=true){route=next;started=true;starting=false;$('#title-screen').hidden=true;$('#title-screen').inert=true;$('#lobby-hud').hidden=false;$('#main').hidden=false;document.body.classList.remove('title-mode');document.body.classList.toggle('lobby-mode',next==='home');document.querySelectorAll('.page').forEach(page=>page.hidden=page.id!==next);document.querySelectorAll('[data-route]').forEach(a=>{if(a.dataset.route===next)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');a.classList.remove('selected')});document.title=`${next==='home'?'LITTLE STUDIO':next.toUpperCase()} · 별탄 BYEOLTAN`;actor.setActive(next==='home'&&!document.hidden);if(focus){window.scrollTo({top:0,left:0,behavior:'instant'});$('#main').focus({preventScroll:true})}}
function start(){if(started||starting)return;starting=true;$('#start-game').disabled=true;$('#title-screen').classList.add('starting');transition.run('ENTERING LITTLE STUDIO',()=>revealPage('home'),()=>{actor.greet()})}
on($('#start-game'),'click',start);
on(document,'keydown',e=>{if(!started&&e.key==='Enter'&&!e.repeat){e.preventDefault();start()}else actor.input()});
on(window,'hashchange',()=>{clearTimeout(menuTimer);const next=parsedRoute();if(!started){revealPage(next);return}if(next===route)return;transition.run(next==='home'?'BACK TO LOBBY':`OPENING ${next.toUpperCase()}`,()=>revealPage(next))});
on(document,'click',e=>{const anchor=e.target.closest('a[href^="#"]');if(!anchor||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const next=anchor.getAttribute('href').slice(1);if(!routes.includes(next))return;if(!started)return;actor.input();if(next===route){if(next==='home')actor.greet();return}e.preventDefault();clearTimeout(menuTimer);document.querySelectorAll('.menu-panel.selected').forEach(a=>a.classList.remove('selected'));anchor.classList.add('selected');if(route==='home')actor.towardMenu(1);menuTimer=setTimeout(()=>{location.hash=next},reduced()?0:150)});
on($('#character'),'click',()=>actor.react());
on($('#character'),'pointerenter',e=>{if(e.pointerType==='mouse')actor.point(.25,-.15)});
on($('#dismiss-dialogue'),'click',()=>dialogue.hide());
on(document,'pointermove',e=>{actor.input();if(!started||route!=='home'||e.pointerType==='touch'||reduced())return;actor.point((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2)},{passive:true});
on(document.documentElement,'pointerleave',()=>actor.leave());
on(window,'blur',()=>actor.leave());
on(document,'pointerdown',()=>actor.input(),{passive:true});
on(document,'visibilitychange',()=>actor.setActive(started&&route==='home'&&!document.hidden));

function toast(message){clearTimeout(toastTimer);$('#system-message').textContent=message;$('#system-message').hidden=false;toastTimer=setTimeout(()=>$('#system-message').hidden=true,3500)}
const audio=new LobbyAudio(enabled=>{$('#bgm').setAttribute('aria-pressed',String(enabled));$('#bgm').setAttribute('aria-label',enabled?'배경음 끄기':'배경음 켜기');$('#bgm-label').textContent=enabled?'SOUND ON':'SOUND OFF';$('#sound-toggle').checked=enabled});
async function setSound(enabled){try{await audio.setEnabled(enabled)}catch{$('#sound-toggle').checked=false;toast('이 브라우저에서 배경음을 시작할 수 없어요. 다시 눌러 주세요.')}}
on($('#bgm'),'click',()=>setSound(!audio.enabled));on($('#sound-toggle'),'change',e=>setSound(e.target.checked));
on($('#volume'),'input',e=>{audio.setVolume(Number(e.target.value)/100);$('#volume-value').textContent=`${e.target.value}%`});
function syncMotion(){document.body.classList.toggle('motion-off',reduced());$('#motion-toggle').checked=motionEnabled;$('#motion-note').textContent=media.matches?'기기의 모션 감소 설정이 켜져 있어 움직임을 줄입니다.':'끄면 캐릭터 움직임과 패럴랙스, 화면 전환이 멈춥니다.';if(reduced()){actor.leave();particles.clear()}}
syncMotion();on(media,'change',syncMotion);
on($('#motion-toggle'),'change',e=>{motionEnabled=e.target.checked;try{localStorage.setItem('byeoltan-motion',motionEnabled?'on':'off')}catch{}syncMotion()});
const settings=$('#settings');on($('#settings-button'),'click',()=>{settings.showModal();actor.setActive(false);$('#close-settings').focus()});on($('#close-settings'),'click',()=>settings.close());on(settings,'close',()=>{actor.setActive(started&&route==='home'&&!document.hidden);$('#settings-button').focus()});
on(settings,'click',e=>{if(e.target!==settings)return;const r=settings.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)settings.close()});
on($('#fullscreen'),'click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('이 브라우저에서는 전체화면을 지원하지 않아요.')}catch{toast('전체화면을 사용할 수 없는 브라우저 환경입니다.')}});
on(document,'fullscreenchange',()=>{const full=!!document.fullscreenElement;$('#fullscreen').setAttribute('aria-pressed',String(full));$('#fullscreen').setAttribute('aria-label',full?'전체화면 끄기':'전체화면 켜기')});
function clock(){const now=new Date();$('#clock').textContent=now.toLocaleTimeString('en-GB',{hour12:false});$('#clock').dateTime=now.toISOString()}
clock();const clockTimer=setInterval(clock,1000);
if(location.hash)revealPage(parsedRoute(),false);
on(window,'pagehide',e=>{if(e.persisted){actor.setActive(false);return}events.abort();clearTimeout(menuTimer);clearTimeout(toastTimer);clearInterval(clockTimer);transition.dispose();actor.dispose();audio.dispose()});
on(window,'pageshow',e=>{if(e.persisted)actor.setActive(started&&route==='home')});
