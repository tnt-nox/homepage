export class GameTransition{
 constructor(root,label,reduced){Object.assign(this,{root,label,reduced});this.timers=[];this.serial=0}
 run(text,change,finish=()=>{}){this.cancel();const serial=this.serial;this.label.textContent=text;if(this.reduced()){change();finish();return}this.root.className='game-transition';void this.root.offsetWidth;this.root.classList.add('cover');this.timers.push(setTimeout(()=>{if(serial!==this.serial)return;change();this.root.classList.add('reveal')},350));this.timers.push(setTimeout(()=>{if(serial!==this.serial)return;this.root.className='game-transition';finish()},740))}
 cancel(){this.serial++;this.timers.forEach(clearTimeout);this.timers=[];this.root.className='game-transition'}
 dispose(){this.cancel()}
}
