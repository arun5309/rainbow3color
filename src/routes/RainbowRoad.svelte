<script lang="ts">
	import { colors, colorsNames, getPermutationMatrix, random1toNOrder } from './utils';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function pickRoad(c: number, v: Array<number>) {
		dispatch('pickRoad', {
			color: c,
			value: v
		});
	}

	// export let rounds: number;
	export let numColors: number = 1;

	let colorsUsed = colorsNames.slice(0, numColors);
	let pMatrix = getPermutationMatrix(numColors);
	let colorPresentationOrder = random1toNOrder(numColors);
</script>

<table id="rainbowRoad">
	<thead>
		<!-- Define headers
        1st and Last columns are for user reference
        Middle Column Titles rendered to match the color order of the permutations in the body -->
		<tr>
			<!-- <th><strong>{gameHeader(rounds)}</strong> Digit</th> -->
			<th style="min-width:30vw"><strong>Your</strong> Digit</th>
			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
			{#each colorsUsed as _, i}
				<th
					style="background-color:{colors[colorPresentationOrder[i]]};
				min-width:{50 / numColors}vw"
				>
					{colorsNames[colorPresentationOrder[i]]}
				</th>
			{/each}
		</tr>
	</thead>
	<tbody id="tableBody">
		<!-- For each digit (0-9) enumerate user options
        then present 'numColors' number of permutations in a random order -->
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as digit}
			<tr>
				<th>{digit} &#10148;</th>
				<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each pMatrix as _, i}
					<th
						style="background-color:{colors[colorPresentationOrder[i]]}; 
                    "
					>
						{pMatrix[colorPresentationOrder[i]][digit]}
					</th>
				{/each}
				<!-- <th>&#60 {digit}</th> -->
			</tr>
		{/each}
	</tbody>
</table>
<br />
<!-- Allow user to select a permutation (or Road). 
    the name of this permutation is the color
    colors are represented as integers for parameterizability -->
<div>
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each colorsUsed as _, i}
		<button
			class="roads"
			style="background-color:{colors[
				colorPresentationOrder[i]
			]}; align-items:center;justify-content:center;"
			on:click={() => pickRoad(colorPresentationOrder[i], pMatrix[colorPresentationOrder[i]])}
		>
			{colorsNames[colorPresentationOrder[i]]} Code
		</button>
	{/each}
</div>

<style>
	table {
		width: 100%;
		border-style: solid;
		border-color: black;
		border-collapse: collapse;
		font-size: 1.3em;
	}
	th {
		border-style: solid;
		border-color: black;
	}
	.roads {
		/* display: grid;
		grid-template-columns: repeat(1, 1fr); */
		min-width: 30vw;
		min-height: 7vh;
		border-style: solid;
		border-color: black;
		font-size: 1em;
		text-align: center;
	}
</style>
