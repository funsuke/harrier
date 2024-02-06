/* eslint-disable @typescript-eslint/naming-convention */
// *************************************************************
// FunMathクラス：ES2015では使えない関数などを追加
// *************************************************************
/* eslint-disable no-unused-vars */
export const FunMath = {
	...Math,
	sign(x: number): number {
		return ((x > 0) ? 1 : (x < 0) ? -1 : +x);
	},
};
