import { Animation, Button, Component, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Q3')
export class Q3 extends Component {
    @property(Button)
    btnPlay: Button = null;

    btnAnimation: Animation = null;
    start() {

    }

    onLoad() {
        this.btnAnimation = this.btnPlay.node.getComponent(Animation);
        const clips = this.btnAnimation.clips;
        if (clips.length >= 2) {
            const secondClip = clips[1];
            this.btnAnimation.on(Animation.EventType.FINISHED, () => {
                this.btnAnimation.play(secondClip.name);
            }, this)

        }
    }

    update(deltaTime: number) {

    }
}


