
export type Variable = {
	index: number;
};

export class Env {
	local: Map<string, Variable> = new Map();

	declare(name: string): Variable {
		let variable = this.get(name);
		// 同名の変数が既にあれば何もせずに終了
		if (variable != null) return variable;
		// インデックスを採番
		const index = this.local.size;
		variable = { index };
		this.local.set(name, variable);
		return variable;
	}

	get(name: string): Variable | undefined {
		const variable = this.local.get(name);
		if (variable == null) return;
		return variable;
	}
}
