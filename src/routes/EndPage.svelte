<script lang="ts">
	let PIN_visible = false;
	export let PIN = '';
</script>

<!-- This title can be uncommmented as needed -->
<!-- <h1>Rainbow Road PIN Entry</h1> -->
{#if PIN_visible}
	<p>{PIN}</p>
{/if}
<button
	id="TogglePIN"
	on:click={() => {
		PIN_visible = !PIN_visible;
	}}>Toggle PIN Visibility</button
>
