// *************************************************************
// タイトルシーンクラス
// *************************************************************

import { SceneGame } from "./sceneGame";

// *************************************************************
// メインクラス
export class SceneTitle extends g.Scene {
	private param: g.GameMainParameterObject;

	// =============================================================
	// コンストラクタ
	constructor(param: g.GameMainParameterObject) {
		// シーン
		super({
			game: g.game,
			assetIds: [
				// タイトル
				"title",
				"start",
				// メイン
				// "harold", "stick0", "stick1", "shadow", "shotPlayer",
				// "nc133497", "sm42205647",
			],
		});
		this.param = param;
		// ゲーム内変数初期化
		g.game.vars.gameState = { score: 0, phoneMode: false };
		// 読込時処理
		this.onLoad.add(() => {
			this.onLoadFunc();
		});
		// シーン上押上時処理
		this.onPointUpCapture.add((ev: g.PointUpEvent) => {
			this.onPointUpFunc(ev);
		});
	}

	// =============================================================
	// シーン読込時処理
	private onLoadFunc(): void {
		// タイムライン
		// const tl = new Timeline(scene);
		// フォント
		// const font = new g.DynamicFont({
		// 	game: g.game,
		// 	fontFamily: "sans-serif",
		// 	size: 96,
		// 	fontColor: "yellow",
		// 	strokeColor: "orangered",
		// 	strokeWidth: 8,
		// });

		// =============================================================
		// タイトル表示(仮)
		this.append(new g.Sprite({
			scene: this,
			src: this.asset.getImageById("title"),
		}));

		// =============================================================
		// シーン更新時処理
		// this.onUpdate.add(() => {
		// 	return;
		// });
	}

	// =============================================================
	// シーン押上時処理
	private onPointUpFunc(ev: g.PointUpEvent): void {
		this.asset.getAudioById("start").play();
		this.setTimeout(() => {
			g.game.pushScene(new SceneGame(this.param));
		}, 2800);
		return;
	};
}
