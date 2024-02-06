// *************************************************************
// 三角形クラス
// https://github.com/lambdataro/akashic-triangle-demo/blob/master/src/main.ts#L143
// *************************************************************
export const TRIANGLE_BASE_WIDTH: number = 150;

export class Triangle extends g.Pane {
	public vx: number = 0;
	public vy: number = 0;
	private baseRect: g.FilledRect;
	private removeArea1: g.FilledRect;
	private removeArea2: g.FilledRect;
	/**
	 * コンストラクタ
	 * @param scene シーン
	 * @param vy 頂点の高さ
	 * @param vx 底辺の左の位置
	 */
	// constructor(scene: g.Scene, _vy: number, _vx: number, _no: number) {
	constructor(scene: g.Scene, _vy: number, _vx: number) {
		// 描画するペイン
		super({
			scene,
			width: g.game.width,
			height: g.game.height,
			// width: rectWidth,
			// height: rectHeight,
			// x: rectPos1.x,
			// y: vy,
		});
		this.vx = _vx;
		this.vy = _vy;
		// 大きい矩形
		this.baseRect = new g.FilledRect({
			scene,
			cssColor: "#73c773",
			width: 0,
			height: 0,
		});
		// if (_no === 0) {
		// 	this.baseRect.cssColor = "#73c573";
		// } else {
		// 	this.baseRect.cssColor = "#83d683";
		// }
		this.append(this.baseRect);
		// 削除する部分
		this.removeArea1 = new g.FilledRect({
			scene,
			cssColor: "#000000",
			width: 0,
			height: 0,
			compositeOperation: "destination-out",
		});
		this.append(this.removeArea1);
		this.removeArea2 = new g.FilledRect({
			scene,
			cssColor: "#000000",
			width: 0,
			height: 0,
			compositeOperation: "destination-out",
		});
		this.append(this.removeArea2);
		// ３点の設定
		this._update(...this.getVertex(_vy, _vx));
		// pos1.changed.add(() => this._update(v1.pt, v2.pt, v3.pt));
		// v2.changed.add(() => this.update(v1.pt, v2.pt, v3.pt));
		// v3.changed.add(() => this.update(v1.pt, v2.pt, v3.pt));
	}

	public _modified(): void {
		const [p1, p2, p3] = this.getVertex(this.vy, this.vx);
		this._update(p1, p2, p3);
	}

	private getVertex(_y: number, _x: number): [g.CommonOffset, g.CommonOffset, g.CommonOffset] {
		const pos1: g.CommonOffset = { x: g.game.width / 2, y: _y };
		const pos2: g.CommonOffset = { x: _x + TRIANGLE_BASE_WIDTH, y: g.game.height };
		const pos3: g.CommonOffset = { x: _x, y: g.game.height };
		return [pos1, pos2, pos3];
	}

	private _update(p1: g.CommonOffset, p2: g.CommonOffset, p3: g.CommonOffset,): void {
		// const [pA, pB, pC] = toCounterClockwise(p1, p2, p3);
		this.updateBaseRect(p1, p2, p3);
		this.updateRemoveArea(p1, p2, this.removeArea1);
		this.updateRemoveArea(p3, p1, this.removeArea2);
	}

	private updateBaseRect(pt1: g.CommonOffset, pt2: g.CommonOffset, pt3: g.CommonOffset): void {
		this.baseRect.x = Math.min(pt1.x, pt2.x, pt3.x);
		this.baseRect.y = Math.min(pt1.y, pt2.y, pt3.y);
		this.baseRect.width = Math.max(pt1.x, pt2.x, pt3.x) - this.baseRect.x;
		this.baseRect.height = Math.max(pt1.y, pt2.y, pt3.y) - this.baseRect.y;
		this.baseRect.modified();
	}

	private updateRemoveArea(p1: g.CommonOffset, p2: g.CommonOffset, rect: g.FilledRect): void {
		const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		const size = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
		const dx = p1.x + Math.cos(angleRad - Math.PI / 2) * size;
		const dy = p1.y + Math.sin(angleRad - Math.PI / 2) * size;
		rect.x = (p2.x + dx) / 2;
		rect.y = (p2.y + dy) / 2;
		rect.width = size * 2;
		rect.height = size;
		rect.anchorX = 0.5;
		rect.anchorY = 0.5;
		rect.angle = angleRad / Math.PI * 180;
		rect.modified();
	}

}

/**
 * 点を反時計回りに並べる
 */
// function toCounterClockwise(
// 	pt1: g.CommonOffset, pt2: g.CommonOffset, pt3: g.CommonOffset
// ): [g.CommonOffset, g.CommonOffset, g.CommonOffset] {
// 	if (pt2.x === pt1.x) {
// 		if ((pt1.y > pt2.y && pt1.x > pt3.x) || (pt1.y <= pt2.y && pt1.x <= pt3.x)) {
// 			return [pt2, pt1, pt3];
// 		} else {
// 			return [pt1, pt2, pt3];
// 		}
// 	} else {
// 		const y = pt1.y + (pt2.y - pt1.y) / (pt2.x - pt1.x) * (pt3.x - pt1.x);
// 		if ((y > pt3.y && pt2.x > pt1.x) || (y <= pt3.y && pt2.x <= pt1.x)) {
// 			return [pt2, pt1, pt3];
// 		} else {
// 			return [pt1, pt2, pt3];
// 		}
// 	}
// }
// TRIANGLE_BASE_WIDTH = 128
// ex) p1.x=620, p1.y = 360
//     p2.x=556, p2.y = 720
//     p3.x=684, p3.y = 720
//     y = p1.y + (p2.y -p1.y) / (p2.x - p1.x) * (p3.x - p1.x)
