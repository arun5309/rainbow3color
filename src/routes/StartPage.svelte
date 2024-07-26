<script>
	// import {createEventDispatcher } from 'svelte'

	// const dispatch = createEventDispatcher();

	// function startGame(){
	//     dispatch('start',{
	//         text:"Started Game"
	//     })
	// }
</script>

<!-- This title can be uncommmented as needed -->
<!-- <h1>Rainbow Road PIN Entry</h1> -->
<buton id="start" on:click>Enter PIN</buton>

<style>
	#start {
		background-color: #22aa22;
		min-width: 80vw;
		min-height: 8vh;
		text-align: center;
		justify-content: center;
		font-size: 1.5em;
	}
</style>
