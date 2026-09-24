export class CharacterDialogue{
 constructor({root,text,announcement,reduced}){Object.assign(this,{root,text,announcement,reduced});this.typing=0;this.hideTimer=0;}
 show(message){this.clearTimers();this.root.hidden=false;this.announcement.textContent=message;this.text.textContent='';if(this.reduced()){this.text.textContent=message}else{const chars=[...message];let i=0;this.typing=setInterval(()=>{this.text.textContent+=chars[i++];if(i>=chars.length){clearInterval(this.typing);this.typing=0}},35)}this.hideTimer=setTimeout(()=>this.hide(),Math.max(3600,message.length*35+2700));}
 clearTimers(){clearInterval(this.typing);clearTimeout(this.hideTimer);this.typing=0;this.hideTimer=0}
 hide(){this.clearTimers();this.root.hidden=true;this.announcement.textContent=''}
 dispose(){this.hide()}
}
