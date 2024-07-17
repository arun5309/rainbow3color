<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { colors } from './utils';
	const dispatch = createEventDispatcher();

	export let keyPadColor: number;

	function forwardNumKey(v: number) {
		dispatch('numKey', {
			value: v
		});
	}
	function forwardActionKey(v: string) {
		dispatch('actionKey', {
			value: v
		});
	}
</script>

<div class="keypad">
	<button
		class="key digit"
		id="key1"
		on:click={() => forwardNumKey(1)}
		style="background-color:{colors[keyPadColor]}">1</button
	>
	<button
		class="key digit"
		id="key2"
		on:click={() => forwardNumKey(2)}
		style="background-color:{colors[keyPadColor]}">2</button
	>
	<button
		class="key digit"
		id="key3"
		on:click={() => forwardNumKey(3)}
		style="background-color:{colors[keyPadColor]}">3</button
	>
	<button
		class="key digit"
		id="key4"
		on:click={() => forwardNumKey(4)}
		style="background-color:{colors[keyPadColor]}">4</button
	>
	<button
		class="key digit"
		id="key5"
		on:click={() => forwardNumKey(5)}
		style="background-color:{colors[keyPadColor]}">5</button
	>
	<button
		class="key digit"
		id="key6"
		on:click={() => forwardNumKey(6)}
		style="background-color:{colors[keyPadColor]}">6</button
	>
	<button
		class="key digit"
		id="key7"
		on:click={() => forwardNumKey(7)}
		style="background-color:{colors[keyPadColor]}">7</button
	>
	<button
		class="key digit"
		id="key8"
		on:click={() => forwardNumKey(8)}
		style="background-color:{colors[keyPadColor]}">8</button
	>
	<button
		class="key digit"
		id="key9"
		on:click={() => forwardNumKey(9)}
		style="background-color:{colors[keyPadColor]}">9</button
	>
	<button class="key action" id="key_backspace" on:click={() => forwardActionKey('backspace')}
		>Backspace</button
	>
	<button
		class="key digit"
		id="key0"
		on:click={() => forwardNumKey(0)}
		style="background-color:{colors[keyPadColor]}">0</button
	>
	<button class="key action" id="key_enter" on:click={() => forwardActionKey('enter')}>Enter</button
	>
</div>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: minmax(100px, auto);
		min-width: 90vw;
		border-style: solid;
	}
	.key {
		display: flex;
		border-style: solid;
		border-color: black;
		align-items: center;
		justify-content: center;
		min-width: 2.5em;
		font-size: 2em;
	}
	.action {
		font-size: 1.2em;
		background-color: #dedede;
		border-color: black;
		border-width: 0.2em;
	}
	.digit {
		font-size: 2em;
	}

	/* #key_backspace {
		border-color: black;
		border-width: 0.2em;
	}
	#key_enter {
		border-color: black;
		border-width: 0.2em;
	} */
</style>
