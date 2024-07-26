// Colors that will be allowed in the rainbow permutation table
export const colors: Array<string> = [
	'#00bb00',
	'#ee9900',
	'#dd60dd',
	'#dddd00',
	'#ADD8E6',
	'#dd0000'
];
export const colorsNames: Array<string> = ['Green', 'Orange', 'Pink', 'Yellow', 'Blue', 'Red'];

export function shuffle(array: Array<number>) {
	let currentIndex = array.length,
		randomIndex;
	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

export function getPermutationMatrix(size: number) {
	if (size > colors.length || size <= 0) {
		console.log('Not right amount of colors available for matrix this size');
		return [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];
	}
	const mat = [];
	for (let i = 0; i < size; i++) {
		mat.push(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
	}
	return mat;
}

export function random1toNOrder(n: number): Array<number> {
	return shuffle(Array.from(Array(n).keys()));
}

export function gameHeader(rounds: number) {
	let a = '';
	switch (rounds) {
		case 1: {
			a = '1st';
			break;
		}
		case 2: {
			a = '2nd';
			break;
		}
		case 3: {
			a = '3rd';
			break;
		}
		case 4: {
			a = '4th';
			break;
		}
		default: {
			a = 'nth';
			break;
		}
	}
	return a;
}
