// *************************************************************
// ゲームシーンクラス
// *************************************************************
import { FunMath } from "./FunMath";
import { TRIANGLE_BASE_WIDTH, Triangle } from "./triangle";

const CX: number = g.game.width / 2;
const CY: number = g.game.height / 2;

const COL_STRIPE_NUM: number = 30;
const FIRST_X: number = CX - (TRIANGLE_BASE_WIDTH * 2) * Math.floor(COL_STRIPE_NUM / 2);
const LAST_X: number = CX + (TRIANGLE_BASE_WIDTH * 2) * (Math.floor(COL_STRIPE_NUM / 2) - 1);
const ROW_STRIPE_NUM: number = 14;
const SCREEN_Z: number = 3333;
const GROUND_CY: number = g.game.height / 3 * 2;

interface Pos3D {
	x: number;
	y: number;
	z: number;
}

// *************************************************************
// メインクラス
export class SceneGame extends g.Scene {
	// ショット可能フラグ
	private flgShot: boolean = false;
	private flgStick: boolean = false;
	// ハロルド目的地
	private dest: g.CommonOffset = { x: CX, y: CY };
	// 音関連
	private mscTheme: g.AudioAsset | null = null;
	private sndShot: g.AudioAsset | null = null;
	private sndReady: g.AudioAsset | null = null;
	// =============================================================
	// コンストラクタ
	constructor(param: g.GameMainParameterObject) {
		// シーン
		super({
			game: g.game,
			assetIds: [
				// タイトル
				// "title",
				// "start",
				// メイン
				"harold", "stick0", "stick1", "shadow", "shotPlayer", "sky",
				"nc133497", "sm42205647", "nc311384",
			],
		});
		// 読込時処理
		this.onLoad.add(() => {
			this.onLoadFunc();
		});
		// シーン押下時処理
		this.onPointDownCapture.add((ev: g.PointDownEvent) => {
			this.onPointDownFunc(ev);
		});
		// シーン上移動時処理
		this.onPointMoveCapture.add((ev: g.PointMoveEvent) => {
			this.onPointMoveFunc(ev);
		});
		// シーン上押上時処理
		this.onPointUpCapture.add((ev: g.PointUpEvent) => {
			this.onPointUpFunc(ev);
		});
	}

	// =============================================================
	// シーン読込時処理
	private onLoadFunc(): void {
		// 音：ショット
		this.sndShot = this.asset.getAudioById("nc133497");
		this.mscTheme = this.asset.getAudioById("sm42205647");
		this.sndReady = this.asset.getAudioById("nc311384");
		this.mscTheme.play().changeVolume(0.5);
		this.sndReady.play();
		// タイムライン
		// const tl = new Timeline(scene);
		// フォント
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 96,
			fontColor: "yellow",
			strokeColor: "orangered",
			strokeWidth: 8,
		});
		// const y: number = CY - 100 * g.game.random.generate() + 50;
		// const x: number = CX - 100 * g.game.random.generate() + 50;
		// let mapDx: number = 0;
		// arrX[50] = x;
		// for (let i = 0; i < 50; i++) {
		// 	const dx = TRIANGLE_BASE_WIDTH * (i * 2 + 2);
		// 	arrX[51 + i] = x + dx;
		// 	arrX[49 - i] = x - dx;
		// }
		// const ground1 = new g.Pane({
		// 	scene: scene,
		// 	width: g.game.width,
		// 	height: g.game.height,
		// });
		// const ground2 = new g.Pane({
		// 	scene: scene,
		// 	width: g.game.width,
		// 	height: g.game.height,
		// });

		// =============================================================
		// 地上：背景塗りつぶし
		const back1 = new g.FilledRect({
			scene: this,
			cssColor: "#A3F7A3",
			width: g.game.width,
			height: g.game.height - GROUND_CY,
			y: GROUND_CY,
		});
		this.append(back1);
		// const back2 = new g.FilledRect({
		// 	scene: scene,
		// 	cssColor: "#93e693",
		// 	width: g.game.width,
		// 	height: g.game.height - GROUND_CY,
		// 	y: GROUND_CY,
		// });
		// ground2.append(back2);

		// =============================================================
		// 地上：縦ライン
		// arrTriangle[50] = new Triangle(scene, y, x);
		// scene.append(arrTriangle[50]);
		// for (let i = 0; i < 50; i++) {
		// 	const dx = TRIANGLE_BASE_WIDTH * (i * 2 + 2);
		// 	arrTriangle[51 + i] = new Triangle(scene, y, x + dx);
		// 	arrTriangle[49 - i] = new Triangle(scene, y, x - dx);
		// 	scene.append(arrTriangle[51 + i]);
		// 	scene.append(arrTriangle[49 - i]);
		// }
		const arrTriangle1: Triangle[] = new Array<Triangle>(COL_STRIPE_NUM);
		// const arrTriangle2: Triangle[] = new Array<Triangle>(COL_STRIPE_NUM);
		const stripeWidth: number = TRIANGLE_BASE_WIDTH * 2;
		for (let i = 0; i < arrTriangle1.length; i++) {
			arrTriangle1[i] = new Triangle(this, GROUND_CY - 30, FIRST_X + stripeWidth * i);
			this.append(arrTriangle1[i]);
			// arrTriangle2[i] = new Triangle(scene, GROUND_CY - 20, FIRST_X + stripeWidth * i, 1);
			// ground2.append(arrTriangle2[i]);
		}

		// =============================================================
		// 地上：横ライン
		const removeRect: g.FilledRect[] = new Array<g.FilledRect>(ROW_STRIPE_NUM);
		const y: number[] = new Array<number>(ROW_STRIPE_NUM);
		for (let i = 0; i < removeRect.length; i++) {
			y[i] = TRIANGLE_BASE_WIDTH * 2 * i;
			const h = getScreenYtoZ(y[i] + TRIANGLE_BASE_WIDTH) - getScreenYtoZ(y[i]);
			removeRect[i] = new g.FilledRect({
				scene: this,
				// cssColor: "#8888ff",
				// cssColor: "#93e693",
				cssColor: "#8bdf8b",
				width: g.game.width,
				height: h,
				y: GROUND_CY + getScreenYtoZ(y[i]),
				opacity: 0.5,
				// compositeOperation: "destination-out",
			});
			this.append(removeRect[i]);
		}

		// =============================================================
		// 空 1x240
		// scaleYのGROUND_CYは何らかの変数になる予定
		const sky = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("sky"),
			anchorY: 1.0,
			scaleX: 1280.0,
			scaleY: GROUND_CY / 240,
			y: GROUND_CY,
		});
		this.append(sky);
		// // =============================================================
		// // 中心の高さまで消す
		// const removeArea1 = new g.FilledRect({
		// 	scene: this,
		// 	cssColor: "#000000",
		// 	width: g.game.width,
		// 	height: 100,
		// 	y: GROUND_CY - 100,
		// 	compositeOperation: "destination-out",
		// });
		// // ground1.append(removeArea1);
		// this.append(removeArea1);
		// const removeArea2 = new g.FilledRect({
		// 	scene,
		// 	cssColor: "#000000",
		// 	width: g.game.width,
		// 	height: 100,
		// 	y: GROUND_CY - 100,
		// 	compositeOperation: "destination-out",
		// });
		// ground2.append(removeArea2);

		// scene.append(ground2);
		// scene.append(ground1);

		// =============================================================
		// ハロルド：影
		const shadow = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("shadow"),
			anchorX: 0.5,
			anchorY: 0.5,
			x: CX,
			y: g.game.height - 112 + 48,
		});
		this.append(shadow);

		// =============================================================
		// ハロルド表示 144x192(48x48)
		// 定速移動
		const spdHarold: number = 48;
		const frmHarold = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("harold"),
			width: 48,
			height: 48,
			frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			frameNumber: 11,
			anchorX: 0.5,
			anchorY: 0.5,
			x: CX,
			y: CY,
			scaleX: 2.0,
			scaleY: 2.0,
		});
		this.append(frmHarold);
		// 更新時処理
		frmHarold.onUpdate.add(() => {
			// 角度を求める
			if (g.game.vars.gameState.phoneMode) {
				console.log("frmHarold::onUpdate");
				console.log("angle:" + (stickRad * 180 / Math.PI));
				if (this.flgStick) {
					frmHarold.x += spdHarold * Math.cos(stickRad);
					frmHarold.y += spdHarold * Math.sin(stickRad);
				} else {
					if (frmHarold.x !== CX || frmHarold.y !== CY) {
						const nowRad = Math.atan2(frmHarold.y - CY, frmHarold.x - CX);
						frmHarold.x -= spdHarold * Math.cos(nowRad);
						frmHarold.y -= spdHarold * Math.sin(nowRad);
						if (Math.abs(frmHarold.x - CX) < spdHarold) frmHarold.x = CX;
						if (Math.abs(frmHarold.y - CY) < spdHarold) frmHarold.y = CY;
					}
				}
			} else {
				const rad = Math.atan2(this.dest.y - frmHarold.y, this.dest.x - frmHarold.x);
				if (frmHarold.x !== this.dest.x) {
					const distX = Math.abs(this.dest.x - frmHarold.x);
					if (distX < spdHarold) {
						frmHarold.x += distX * Math.cos(rad);
						if (Math.abs(this.dest.x - frmHarold.x) < 1) {
							frmHarold.x = this.dest.x;
						}
					} else {
						frmHarold.x += spdHarold * Math.cos(rad);
					}
				}
				if (frmHarold.y !== this.dest.y) {
					const distY = Math.abs(this.dest.y - frmHarold.y);
					if (distY < spdHarold) {
						frmHarold.y += distY * Math.sin(rad);
						if (Math.abs(this.dest.y - frmHarold.y) < 1) {
							frmHarold.y = this.dest.y;
						}
					} else {
						frmHarold.y += spdHarold * Math.sin(rad);
					}
				}
			}
			// 移動制限
			if (frmHarold.x < 96) this.dest.x = frmHarold.x = 96;
			if (frmHarold.x > g.game.width - 64) this.dest.x = frmHarold.x = g.game.width - 96;
			if (frmHarold.y < 96) this.dest.y = frmHarold.y = 96;
			if (frmHarold.y > g.game.height - 112) this.dest.y = frmHarold.y = g.game.height - 112;
			// 下部の場合、歩行アニメーション
			if (frmHarold.y >= g.game.height - 128) {
				frmHarold.angle = 0;
				if (g.game.age % 3 === 0) {
					frmHarold.frameNumber = ((frmHarold.frameNumber + 1) % 3) + 9;
				}
			} else {
				// それ以外は傾きを設定
				frmHarold.frameNumber = 11;
				const dx = frmHarold.x - CX;
				frmHarold.angle = FunMath.sign(dx) * 30 * Math.pow(dx / (CX - 64), 2);
				// if (frmHarold.x < g.game.width / 4) {
				// 	frmHarold.angle = -30;
				// } else if (frmHarold.x > g.game.width * 3 / 4) {
				// 	frmHarold.angle = 30;
				// } else {
				// 	frmHarold.angle = 0;
				// }
			}
			frmHarold.modified();
			// 影
			shadow.x = frmHarold.x;
			shadow.modified();
			// ハロルドの位置による地面の移動
			dx = (CX - frmHarold.x) / (CX) * 64;
			dx = Math.abs(dx) < 5 ? 0 : dx;
		});

		// =============================================================
		// 弾表示
		let shotIdx: number = 0;
		const shot: g.FrameSprite[] = new Array<g.FrameSprite>(10);
		const shotPos: Pos3D[] = new Array<Pos3D>(10);
		const shotShadow: g.Sprite[] = new Array<g.Sprite>(10);
		const shotShadowPos: Pos3D[] = new Array<Pos3D>(10);
		for (let i = 0; i < shot.length; i++) {
			// 弾影の位置を設定 yは適当
			shotShadowPos[i] = { x: frmHarold.x, y: g.game.width, z: SCREEN_Z };
			// 弾影エンティティを設定
			shotShadow[i] = new g.Sprite({
				scene: this,
				src: this.asset.getImageById("shadow"),
				anchorX: 0.5,
				anchorY: 0.5,
				x: frmHarold.x - CX,
				y: g.game.height - 112 + 48,
				hidden: true,
			});
			this.append(shotShadow[i]);
			// 弾の位置を設定
			const shPos = shotPos[i] = { x: frmHarold.x, y: frmHarold.y, z: SCREEN_Z };
			// 弾エンティティを設定
			const sh = shot[i] = new g.FrameSprite({
				scene: this,
				src: this.asset.getImageById("shotPlayer"),
				width: 64,
				height: 43,
				frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				frameNumber: 0,
				interval: 2 / g.game.fps,
				anchorX: 0.5,
				anchorY: 0.5,
				scaleX: 5.0,
				scaleY: 5.0,
				x: shPos.x,
				y: shPos.y,
				loop: true,
				hidden: true,
			});
			// 更新時処理
			sh.onUpdate.add(() => {
				if (shPos.z > 0) {
					// sh.scale(5000 / (SCREEN_Z + 1000 - shPos.z));
					// 5000 : 1000 が 5.0 になるように増減すると拡縮の速さがが変わる
					sh.scale(2500 / (SCREEN_Z + 500 - shPos.z));
					shPos.z -= 200;
					if (shPos.z <= 0) {
						sh.hide();
					} else {
						sh.modified();
					}
				}
			});
			this.insertBefore(sh, frmHarold);
			sh.start();
		};

		// =============================================================
		// 仮想スティック表示(out:300x300,in:150x150)
		const spdStick: number = 48;
		const stickCX: number = 64 + 300 / 2;
		const stickCY: number = g.game.height - 64 - 300 / 2;
		let stickRad: number = 0;
		// 外側の円
		const stick0 = (new g.Sprite({
			scene: this,
			src: this.asset.getImageById("stick0"),
			anchorX: 0.5,
			anchorY: 0.5,
			x: stickCX,
			y: stickCY,
		}));
		// スティック本体
		const stick1 = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("stick1"),
			anchorX: 0.5,
			anchorY: 0.5,
			x: stickCX,
			y: stickCY,
			touchable: true,
		});
		console.log(g.game.vars.gameState.phoneMode);
		if (g.game.vars.gameState.phoneMode) {
			// スティック更新時処理
			stick1.onUpdate.add(() => {
				// スマホモードフラグがオフであれば抜ける
				if (!g.game.vars.gameState.phoneMode || this.flgStick) return;
				console.log("stick1::onUpdate");
				console.log("angle:" + stickRad);
				// スティックを中心に戻す
				stick1.x -= spdStick * Math.cos(stickRad);
				stick1.y -= spdStick * Math.sin(stickRad);
				if (Math.abs(stickCX - stick1.x) <= spdStick) stick1.x = stickCX;
				if (Math.abs(stickCY - stick1.y) <= spdStick) stick1.y = stickCY;
				stick1.modified();
			});
			// スティック押下時処理
			stick1.onPointDown.add((ev: g.PointDownEvent) => {
				console.log("stick1::onPointDown");
				console.log("C(x,y)=" + stickCX + "," + stickCY);
				console.log(" (x,y)=" + ev.point.x + "," + ev.point.y);		// 触ったエンティティの左上を(0,0)とした相対座標
				// スティック使用フラグオン
				this.flgStick = true;
				// スティック位置の移動
				stick1.x += ev.point.x - 150;
				stick1.y += ev.point.y - 150;
				console.log(" (x,y)=" + stick1.x + "," + stick1.y);
				// 角度の計算
				stickRad = Math.atan2(stick1.y - stickCY, stick1.x - stickCX);
				console.log("angle:" + (stickRad * 180 / Math.PI));
				// 移動制限
				const cx = 150 * Math.cos(stickRad);
				const cy = 150 * Math.sin(stickRad);
				if (Math.abs(stick1.x - stickCX) > Math.abs(cx) || Math.abs(stick1.y - stickCY) > Math.abs(cy)) {
					stick1.x = stickCX + cx;
					stick1.y = stickCY + cy;
				}
				stick1.modified();
			});
			// スティック移動時処理
			stick1.onPointMove.add((ev: g.PointMoveEvent) => {
				console.log("stick1::onPointMove");
				// スティック使用フラグオン
				this.flgStick = true;
				// スティック位置の移動
				stick1.x += ev.prevDelta.x;
				stick1.y += ev.prevDelta.y;
				// 角度の計算
				stickRad = Math.atan2(stick1.y - stickCY, stick1.x - stickCX);
				console.log("angle:" + (stickRad * 180 / Math.PI));
				// 移動制限
				const cx = 150 * Math.cos(stickRad);
				const cy = 150 * Math.sin(stickRad);
				if (Math.abs(stick1.x - stickCX) > Math.abs(cx) || Math.abs(stick1.y - stickCY) > Math.abs(cy)) {
					stick1.x = stickCX + cx;
					stick1.y = stickCY + cy;
				}
				stick1.modified();
			});
			// スティック押上時処理
			stick1.onPointUp.add((ev: g.PointUpEvent) => {
				console.log("stick1::onPointUp");
				// スティック使用フラグオフ
				this.flgStick = false;
			});
			this.append(stick0);
			this.append(stick1);
		}

		// =============================================================
		// 点数表示：テスト
		const lblScore = new g.Label({
			scene: this,
			font: font,
			text: "0",
			x: 0,
			y: 0
		});
		lblScore.onUpdate.add(() => {
			lblScore.text = "" + g.game.vars.gameState.score;
			lblScore.invalidate();
		});
		this.append(lblScore);

		// =============================================================
		// シーン更新時処理：地上
		// console.log(`max:${arrTriangle[arrTriangle.length - 1].vx}`);	// 50:6784
		// console.log(`min:${arrTriangle[0].vx}`);		// 50:-5760
		// console.log(`max:${LAST_X}`);	// 50:6784
		// console.log(`min:${FIRST_X}`);		// 50:-5760
		// 10240-640 =  9600
		// -8960-640 = -9600
		// 0.25 / (1-z)
		let dx: number = 0;
		let dy: number = 100;
		const RANGE_X: number = LAST_X - FIRST_X;
		const upX: number = TRIANGLE_BASE_WIDTH * 2 - FIRST_X;
		const RANGE_Y: number = TRIANGLE_BASE_WIDTH * 2 * removeRect.length;
		this.onUpdate.add(() => {
			for (let i = 0; i < Math.max(arrTriangle1.length, removeRect.length); i++) {
				if (i < arrTriangle1.length) {
					arrTriangle1[i].vx = ((arrTriangle1[i].vx + upX + dx) % RANGE_X) + FIRST_X;
					arrTriangle1[i]._modified();
				}
				// arrTriangle2[i].vx = ((arrTriangle2[i].vx + upX + dx) % RANGE_X) + FIRST_X;
				// arrTriangle2[i]._modified();
				if (i < removeRect.length) {
					y[i] = (y[i] + dy + RANGE_Y) % RANGE_Y;
					const h = getScreenYtoZ(y[i] + TRIANGLE_BASE_WIDTH) - getScreenYtoZ(y[i]);
					removeRect[i].y = GROUND_CY + getScreenYtoZ(y[i]) - 120;
					removeRect[i].height = h;
					removeRect[i].modified();
				}
			}
		});

		// =============================================================
		// シーン更新時処理：弾自動発射
		// window.addEventListener("keydown", (ev: any) => {
		this.onUpdate.add(() => {
			// 弾自動発射
			if (this.flgShot) {
				if (g.game.age % 5 === 0) {
					const sh = shot[shotIdx];
					const shPos = shotPos[shotIdx];
					if (this.sndShot != null) {
						this.sndShot.play().changeVolume(0.1);
					}
					sh.x = shPos.x = frmHarold.x;
					sh.y = shPos.y = frmHarold.y;
					shPos.z = SCREEN_Z;
					sh.show();
					sh.modified();
					shotIdx = (shotIdx + 1) % shot.length;
				}
			}
		});
	}

	// =============================================================
	// シーン押下時処理
	private onPointDownFunc(ev: g.PointDownEvent): void {
		// テスト用のスコア
		g.game.vars.gameState.score++;
		// ハロルドの目的地
		this.dest.x = ev.point.x;
		this.dest.y = ev.point.y;
		// 移動と同時にショット解禁
		this.flgShot = true;
	}

	// =============================================================
	// シーン上移動時処理
	private onPointMoveFunc(ev: g.PointMoveEvent): void {
		// ハロルドの目的地の更新
		this.dest.x += ev.prevDelta.x;
		this.dest.y += ev.prevDelta.y;
	};

	// =============================================================
	// シーン押上時処理
	private onPointUpFunc(ev: g.PointUpEvent): void {
		// ハロルドの目的地を中心に更新
		this.dest.x = CX;
		this.dest.y = CY;
		// マウスや指を上げたらショット終わり
		this.flgShot = false;
	};
}

function getScreenYtoZ(z: number): number {
	const nearZ: number = 5000;
	if (z < 0 || z >= nearZ) return -1;
	// y_screen = (y_world / z_world) / z_world
	// 0.25 / (1-z)
	// return 600000 / (nearZ - z);
	return 600000 / (nearZ - z);
}

// function getScaleToZ(z: number): number {
// 	const nearZ: number = 5000;
// 	if (z < 0 || z > nearZ) return -1;
// 	return 5.0 / ((nearZ - z));
// }

// function noName(_x: number, _y: number, _z: number): [x: number, y: number, scale: number] {
// 	const x: number = 0;
// 	const y: number = 0;
// 	const scale: number = 1.0;
// 	return [x, y, scale];
// };
