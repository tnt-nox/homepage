export class CharacterParticles{
 constructor(root,reduced){this.root=root;this.reduced=reduced;this.timer=0}
 burst(){this.clear();if(this.reduced())return;for(let i=0;i<5;i++){const p=document.createElement('i');p.textContent=i%2?'♥':'✦';p.style.setProperty('--dx',`${(i-2)*38}px`);p.style.setProperty('--dy',`${-70-Math.random()*55}px`);p.style.setProperty('--r',`${(i-2)*15}deg`);this.root.append(p)}this.timer=setTimeout(()=>this.clear(),950)}
 clear(){clearTimeout(this.timer);this.root.replaceChildren()}
 dispose(){this.clear()}
}
