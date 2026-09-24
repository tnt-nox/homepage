import {chooseDialogue} from './dialogues.js';
export const STATES=Object.freeze(['IDLE','LOOK','HAPPY','SURPRISED','BOUNCE','TALK','SLEEP']);
const durations={IDLE:Infinity,LOOK:1.8,HAPPY:1.05,SURPRISED:.85,BOUNCE:1.55,TALK:2.5,SLEEP:Infinity};
export class CharacterActor{
 constructor({renderer,dialogue,particles,reduced,random=Math.random,sleepAfter=45000,now=()=>performance.now()}){Object.assign(this,{renderer,dialogue,particles,reduced,random,sleepAfter,now});this.state='IDLE';this.elapsed=0;this.time=0;this.active=false;this.disposed=false;this.lastInput=now();this.lastFrame=0;this.raf=0;this.target={x:0,y:0};this.look={x:0,y:0};this.idleAt=6+random()*5;this.lastReaction='';this.frequency=.9+random()*.3;this.renderer.reset();this.frame=this.frame.bind(this)}
 transition(state){if(!STATES.includes(state))throw new Error(`Unknown character state: ${state}`);this.state=state;this.elapsed=0;}
 input(){this.lastInput=this.now();if(this.state==='SLEEP')this.transition('IDLE')}
 point(x,y){this.input();if(this.reduced())return;this.target={x:Math.max(-1,Math.min(1,x)),y:Math.max(-1,Math.min(1,y))};if(this.state==='IDLE')this.transition('LOOK')}
 leave(){this.target={x:0,y:0}}
 react(){this.input();const choices=['HAPPY','SURPRISED','BOUNCE','TALK'].filter(s=>s!==this.lastReaction);const next=choices[Math.floor(this.random()*choices.length)];this.lastReaction=next;this.particles.clear();this.transition(next);this.dialogue.show(chooseDialogue(next,this.random));if(next==='HAPPY'||next==='BOUNCE')this.particles.burst();return next}
 greet(){this.input();this.transition('TALK');this.dialogue.show(chooseDialogue('WELCOME',this.random))}
 towardMenu(direction=1){this.input();this.target={x:direction,y:-.15};this.transition('LOOK')}
 setActive(active){if(this.disposed)return;this.active=active;cancelAnimationFrame(this.raf);this.lastFrame=0;if(active){this.lastInput=this.now();this.transition('IDLE');this.raf=requestAnimationFrame(this.frame)}else{this.dialogue.hide();this.particles.clear();this.renderer.reset()}}
 update(dt){this.time+=dt;this.elapsed+=dt;const reduced=this.reduced();const k=1-Math.exp(-7*dt);this.look.x+=(this.target.x-this.look.x)*k;this.look.y+=(this.target.y-this.look.y)*k;if(!reduced&&this.now()-this.lastInput>this.sleepAfter&&this.state!=='SLEEP'){this.transition('SLEEP');this.leave();this.dialogue.hide()}if(this.elapsed>=durations[this.state])this.transition('IDLE');if(!reduced&&this.state==='IDLE'&&this.time>=this.idleAt){this.target={x:(this.random()-.5)*.8,y:(this.random()-.5)*.3};this.transition('LOOK');this.frequency=.9+this.random()*.3;this.idleAt=this.time+7+this.random()*6}
  const breath=Math.sin(this.time*this.frequency*1.7);const pose={x:this.look.x*11,y:breath*2.4,rotation:this.look.x*1.9+Math.sin(this.time*.7)*.35,sx:1+breath*.005,sy:1+breath*.012,shadow:1-breath*.016,shadowOpacity:.85,lookX:this.look.x,lookY:this.look.y};
  const t=Math.min(1,this.elapsed/durations[this.state]);
  if(this.state==='HAPPY'){if(t<.15){pose.sy-=.05*(t/.15)}else{const flight=Math.min(1,(t-.15)/.85);pose.y-=4*30*flight*(1-flight);pose.rotation+=Math.sin(flight*Math.PI)*-3;pose.shadow=1-Math.sin(flight*Math.PI)*.18;pose.shadowOpacity=.65}}
  if(this.state==='SURPRISED'){const decay=(1-t);pose.x+=Math.sin(t*Math.PI*6)*9*decay;pose.rotation+=Math.sin(t*Math.PI*4)*4*decay;pose.sx+=Math.sin(t*Math.PI)*.015}
  if(this.state==='BOUNCE'){pose.y-=Math.abs(Math.sin(t*Math.PI*2))*21*(1-.35*t);pose.sy+=Math.cos(t*Math.PI*4)*.018;pose.shadow=1-Math.abs(Math.sin(t*Math.PI*2))*.15}
  if(this.state==='TALK'){pose.rotation+=Math.sin(t*Math.PI*2)*.9}
  if(this.state==='SLEEP'){const ease=Math.min(1,this.elapsed/1.2);pose.y+=7*ease;pose.rotation=-5*ease;pose.sy=1+Math.sin(this.time*1.15)*.007;pose.sx=1;pose.x=this.look.x*4}
  if(reduced){Object.assign(pose,{x:0,y:0,rotation:0,sx:1,sy:1,shadow:1,shadowOpacity:1,lookX:0,lookY:0});if(this.state==='SLEEP')this.transition('IDLE')}
  this.renderer.render(pose,this.state);return pose;
 }
 frame(timestamp){if(!this.active||this.disposed)return;const dt=this.lastFrame?Math.min(.04,(timestamp-this.lastFrame)/1000):0;this.lastFrame=timestamp;this.update(dt);this.raf=requestAnimationFrame(this.frame)}
 dispose(){this.disposed=true;this.active=false;cancelAnimationFrame(this.raf);this.dialogue.dispose();this.particles.dispose();this.renderer.dispose()}
}
