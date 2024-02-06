import { SceneTitle } from "./sceneTitle";
// *************************************************************
// メインクラス
// *************************************************************
// テンプレート
// akashic init -t typescript
// gの定義
// https://akashic-games.github.io/guide/common-pitfalls.html
// npm install -DE @akashic/akashic-engine
// Zipファイル(上書き)
// akashic export zip --output game.zip --nicolive --f

// ・地上表示位置
// 　キャラ最上位置 => CY => 360
// 　キャラ最下位置 => 78
// 　地上表示位置範囲 => 360 - 78 => 282
// ・ステージの時間
// 　大体ステージ開始から、1分でステージボス
// 　3ステージ作るとしたら、50秒未満でクリアできるようにしたい
// 　でも作るとしたら2ステージまでくらい
// 　3ステージフル(180秒くらい)はニコ生ゲームでは長すぎる

// (CX,CY)からの相対座標とし、p.y=g.game.width/2 とすると...
// CY - 112 + 48 = p.y * p.z / ?
// 720 / 2 - 112 + 46 = 720 / 2 * 3333 / ?
// 360 - 112 + 46 = 360 * 3333 / ?
// 294 = 360 * (10000 / 3) * (1 / ?)
// ? = 360 * (10000 / 3) * (1 / 294)
// ? = 4081.632653061224

function main(param: g.GameMainParameterObject): void {
	// 次のシーンへ
	g.game.pushScene(new SceneTitle(param));
}

export = main;
