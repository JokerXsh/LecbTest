import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Q2')
export class Q2 extends Component {
    start() {
        let a: number[] = [10, 40, 5, 280];
        let b: number[] = [234, 5, 2, 148, 23];
        let v = 42;
        //根据大 O 表示法，时间复杂度为O(mn),m表示数组a的长度，n表示数组b的长度
        this.findSum(a, b, v);
    }

    findSum(a: number[], b: number[], v: number): boolean {
        //假设A的长度为m，因为外层循环会遍历整个数组a，它的长度为m
        for (let numA of a) {
            //假设B的长度为n，外层的每一次循环，内层循环会遍历整个数组b一遍，它的长度为n
            for (let numB of b) {
                if (numA + numB === v) {
                    return true;
                }
            }
        }
        //总的循环执行次数就是m和n的乘积，所以时间复杂度为O(mn)
        return false;
    }

    update(deltaTime: number) {

    }
}


