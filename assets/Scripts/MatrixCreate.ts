import { _decorator, Button, Color, Component, EditBox, instantiate, Label, log, Node, Prefab, Rect, Size, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

const COLORS: Color[] = [
    new Color(255, 0, 0),
    new Color(0, 255, 0),
    new Color(0, 0, 255),
    new Color(255, 255, 0),
    new Color(255, 0, 255),
];

enum BtnState {
    Create,
    Reset
}
@ccclass("MatrixCreate")
export class MaCreate extends Component {
    @property(EditBox)
    editBoxX: EditBox = null;

    @property(EditBox)
    editBoxY: EditBox = null;

    @property(Button)
    btnCreate: Button = null;

    @property(Node)
    boxContainer: Node = null;

    @property(Prefab)
    brickPrefab: Prefab = null;
    private colorCache: (Color | null)[][] = [];
    private btnState: BtnState = BtnState.Create;
    start() {
        log("MatrixCreate");
        this.btnState = BtnState.Create;
    }

    onLoad(): void {
        this.btnCreate.node.on("click", this.onBtnClick, this);
    }

    onBtnClick() {
        if (this.btnState == BtnState.Create) {
            this.createMatrix();
        }
        else {
            this.resetMatrix();
            this.createMatrix();
        }
    }

    resetMatrix() {
        this.colorCache = [];
        this.boxContainer.removeAllChildren();
        this.btnCreate.getComponentInChildren(Label).string = "生成";
        this.btnState = BtnState.Create;
    }

    createMatrix() {
        let x = parseInt(this.editBoxX.string);
        let y = parseInt(this.editBoxY.string);
        if (x && y) {
            log("x: " + x + " y: " + y);
            const matrixBox = this.boxContainer;
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const brickNode = new Node(`brickId${row}_${col}`);
                    matrixBox.addChild(brickNode);
                    const brickPrefab = instantiate(this.brickPrefab);
                    brickNode.addChild(brickPrefab);
                    const sprite = brickPrefab.getComponent(Sprite);
                    if (sprite) {
                        const color = this.getBrickColor(row, col);
                        sprite.color = color;
                    }

                    brickNode.setPosition(col * (40 + 5), row * (40 + 5), 0);
                }
            }
            this.btnCreate.getComponentInChildren(Label).string = "重新生成";
            this.btnState = BtnState.Reset;
        }

    }

    getBrickColor(row: number, col: number): Color {
        if (row == 0 && col == 0) {
            return COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        if (this.colorCache[row] && this.colorCache[row][col]) {
            return this.colorCache[row][col] as Color;
        }

        const baseProb: number[] = new Array(COLORS.length).fill(Math.floor(100 / COLORS.length));
        const x = parseInt(this.editBoxX.string);
        const y = parseInt(this.editBoxY.string);
        if (col > 0) {
            const leftColor = this.getBrickColor(row, col - 1);
            const leftIndex = COLORS.indexOf(leftColor);
            baseProb[leftIndex] += x;
        }
        if (row > 0) {
            const topColor = this.getBrickColor(row - 1, col);
            const topIndex = COLORS.indexOf(topColor);
            baseProb[topIndex] += x;
            if (col > 0) {
                const topLeftColor = this.getBrickColor(row, col - 1);
                if (topColor.equals(topLeftColor)) {
                    baseProb[topIndex] -= (x - y);
                }
            }
        }
        const remainProb = 100 - baseProb.reduce((sum, prob) => sum + prob, 0);
        const otherColors = baseProb.map((prob, index) => {
            return { index, prob };
        }).filter(({ prob }) => prob === 20);

        const otherColorProb = remainProb / otherColors.length;
        otherColors.forEach(({ index }) => {
            baseProb[index] += otherColorProb;
        });

        const randomProb = Math.random() * 100;
        let sum = 0;
        let returnedColor = COLORS[0];
        for (let i = 0; i < baseProb.length; i++) {
            sum += baseProb[i];
            if (randomProb < sum) {
                returnedColor = COLORS[i];
                break;
            }
        }

        if (!this.colorCache[row]) {
            this.colorCache[row] = [];
        }
        this.colorCache[row][col] = returnedColor;

        return returnedColor;
    }

    update(deltaTime: number) { }
}
