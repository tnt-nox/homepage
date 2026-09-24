// Renderer contract: render(pose, state), reset(), dispose().
// Keep the original artwork intact; all motion transforms the whole image.
// A Live2D/Rive/parts renderer can replace this adapter without changing the actor.
export class CharacterRenderer{
 constructor({visual,button,shadow,sleep,parallax}){Object.assign(this,{visual,button,shadow,sleep,parallax});this.state='';}
 render(pose,state){this.visual.style.transform=`translate3d(${pose.x.toFixed(2)}px,${pose.y.toFixed(2)}px,0) rotate(${pose.rotation.toFixed(2)}deg) scale(${pose.sx.toFixed(4)},${pose.sy.toFixed(4)})`;this.shadow.style.transform=`scale(${pose.shadow.toFixed(3)})`;this.shadow.style.opacity=String(pose.shadowOpacity);if(this.state!==state){this.button.dataset.state=state;this.sleep.hidden=state!=='SLEEP';this.state=state}for(const layer of this.parallax){const depth=Number(layer.dataset.parallax);layer.style.transform=`translate3d(${(pose.lookX*depth).toFixed(2)}px,${(pose.lookY*depth).toFixed(2)}px,0)`}}
 reset(){this.render({x:0,y:0,rotation:0,sx:1,sy:1,shadow:1,shadowOpacity:1,lookX:0,lookY:0},'IDLE')}
 dispose(){this.reset()}
}
