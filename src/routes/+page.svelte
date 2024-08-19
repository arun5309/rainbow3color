<script lang="ts">
	import StartPage from './StartPage.svelte'; // This line is for the demo version of the experiment
	import KeyPad from './KeyPad.svelte';
	import RainbowRoad from './RainbowRoad.svelte';
	import EndPage from './EndPage.svelte'; // This line is for the demo version of the experiment
	import { colorsNames, gameHeader } from './utils';
	import type { CreateInstanceResponse, UpdateInstanceResponse, GetPointsResponse } from './logic';
	import banner from '$lib/images/Banners_Rainbow_Road.png';

	// Initial game state values
	let showStartScreen = true;
	let showKeypadScreen = false;
	let showRainbowScreen = false;
	let showEndScreen = false;
	let showTutorialElements = false;
	let show_pin = false;
	let value = '';
	let permutation: Array<number> = [];
	let rounds = 0;
	let round_per_digit = 0;
	let userEnteredPIN = '';

	// Phase Staging
	function stageKeyPadScreen() {
		showStartScreen = false;
		showKeypadScreen = true;
		showRainbowScreen = false;
		showEndScreen = false;
	}
	function stageRainbowScreen() {
		showStartScreen = false;
		showKeypadScreen = false;
		showRainbowScreen = true;
		showEndScreen = false;
	}
	function stageEndScreen() {
		showStartScreen = false;
		showKeypadScreen = false;
		showRainbowScreen = false;
		showEndScreen = true;
	}

	// from KeyPad
	let keyPadColor: number;
	function handleNumKeyPress(event: CustomEvent) {
		let num = event.detail.value;
		if (value.length > 0) {
			console.log('no more input allowed');
		} else {
			value = value.concat(num);
		}
	}
	function handleActionKeyPress(event: CustomEvent) {
		let key = event.detail.value;
		if (key === 'backspace') {
			value = value.substring(0, value.length - 1);
		} else if (key === 'enter' && value.length > 0) {
			let mappedPINDigit = String(permutation.indexOf(Number(value)));
			userEnteredPIN = userEnteredPIN.concat(mappedPINDigit);
			permutation = [];
			value = '';
			rounds += 1;
			if (rounds >= 4) {
				finish_transition();
			} else {
				stageRainbowScreen();
			}
		} else if (key === 'enter' && value.length === 0) {
			console.log('Ptp tried submitting blank');
		} else {
			console.log("Something other than 'backspace' or 'enter' was sent");
		}
	}

	// from RainbowRoad
	let numColors: number = 5;
	function handlePickRoad(event: CustomEvent) {
		let colorIndex = event.detail.color;
		let perm = event.detail.value;

		keyPadColor = colorIndex;
		permutation = perm;

		console.log('Color Index of Road chosen: ' + colorIndex);
		console.log('Permutation: ' + perm);
		stageKeyPadScreen();
	}

	let uid: string = '';
	let uid_valid: boolean = false;
	$: uid_valid = check_uid_valid(uid);
	let iid: number = -1;
	let actual_pin: string = '';
	const USER_ID_LENGTH = 6;

	function reset() {
		showStartScreen = true;
		showKeypadScreen = false;
		showRainbowScreen = false;
		showEndScreen = false;
		showTutorialElements = false;
		value = '';
		permutation = [];
		rounds = 0;
		userEnteredPIN = '';

		showStartScreen = true;
		show_pin = false;
		uid_valid = false;
		iid = -1;
		actual_pin = '';
		const temp = uid;
		uid = '';
		uid = temp;
	}

	async function get_points(): Promise<GetPointsResponse> {
		const url = `https://pinentry.net/points/${uid.toLowerCase()}`;
		const request = new Request(url, { method: 'GET' });
		const data = await fetch(request);
		return <GetPointsResponse>(<unknown>data.json());
	}

	function normalize() {
		uid = uid;
	}

	function set_actual_pin(val: string) {
		actual_pin = val;
	}

	function isAlphaNumeric(str: string): boolean {
		let code, i, len;
		for (i = 0, len = str.length; i < len; i++) {
			code = str.charCodeAt(i);
			if (!(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123)) {
				return false;
			}
		}
		return true;
	}

	function check_uid_valid(uid_cand: string): boolean {
		return uid_cand.length === USER_ID_LENGTH && isAlphaNumeric(uid_cand);
	}

	function progress_transition() {
		if (!uid_valid) return;
		const url = 'https://pinentry.net/create_instance';
		const data = {
			game_id: 'IMMM',
			user_id: uid.toLowerCase()
		};
		const request = new Request(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json; charset=UTF-8'
			})
		});
		fetch(request).then((create_instance_value_temp) => {
			create_instance_value_temp.json().then((temp) => {
				const create_instance_value = <CreateInstanceResponse>(<unknown>temp);
				iid = create_instance_value.iid;
				stageRainbowScreen();
			});
		});
	}

	function finish_transition() {
		stageEndScreen()
		// --- Below is code to integrate end screen into the Data Collection version of this scheme
		const url = 'https://pinentry.net/update_instance';
		const data = {
			iid_value: iid,
			result_pin: userEnteredPIN
		};
		const request = new Request(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json; charset=UTF-8'
			})
		});
		fetch(request).then((instance_response_value_temp) => {
			instance_response_value_temp.json().then((temp) => {
				const instance_response_value = <UpdateInstanceResponse>(<unknown>temp);
				if (iid !== instance_response_value.iid) {
					alert('Reached invalid state, please report bug!');
				}
				stageEndScreen();
			});
		});
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if showStartScreen}
		<img src={banner} alt="Rainbow Road" width="100%" height="30%" />
		<br>
		<!-- Below is code to integrate start screen into the Data Collection version of this scheme -->
		<br />
		<input
			type="text"
			placeholder="User ID"
			bind:value={uid}
			on:change={normalize}
			maxlength={USER_ID_LENGTH}
			name="userid"
			id="userid"
		/>
		{#if uid_valid}
			{#await get_points()}
				<p>Validating User ID...</p>
			{:then get_points_value}
				{#if get_points_value.uid !== null}
					{(set_actual_pin(get_points_value.actual_pin), '')}
					<p style="color: green">Points: {get_points_value.points}</p>
				{:else}
					<p style="color: red">Invalid User ID!</p>
				{/if}
			{:catch error}
				{(console.log(error), '')}
				<p style="color: purple">Network Error: Unable to check validity of User ID!</p>
			{/await}
		{/if}
		<br />
		<button on:click={progress_transition}>Start Game</button>

		<!-- Below is the code for the start page of the demo version of this password entry method -->
		<!--<StartPage on:click={() => stageRainbowScreen()} />-->
	{/if}

	{#if showKeypadScreen}
		<h1><strong>{gameHeader(rounds + 1)} digit </strong>| Round {(round_per_digit % 2) + 2}</h1>
		<input id="PIN_Entry" bind:value maxlength="1" /><br />
		<KeyPad {keyPadColor} on:numKey={handleNumKeyPress} on:actionKey={handleActionKeyPress} />
		<h1>Type the <strong>{colorsNames[keyPadColor]} Code</strong> for your digit</h1>
	{/if}

	{#if showRainbowScreen}
		{#if showTutorialElements}
			<h2>
				<!-- <strong><u>{gameHeader(rounds + 1)} digit: </u></strong> of 4 on the margins. Remember one of your
				digit's codes. -->
			</h2>
		{:else}
			<h1><strong>{gameHeader(rounds + 1)} digit </strong>| Round {(round_per_digit % 2) + 1}</h1>
		{/if}
		<RainbowRoad {numColors} on:pickRoad={handlePickRoad} />
		<h1>
			<strong>Look</strong> at your digit. <br>
			<strong>Pick</strong> a Color. <br>
			<strong>Remember</strong> the corresponding number
		</h1>
	{/if}

	{#if showEndScreen}
		<img src={banner} alt="Rainbow Road" width="100%" height="30%" />
		<br />
		<!-- Below is code to integrate the end screen into the Data Collection version of this password entry method -->
		{#if show_pin}
			<div>Entered PIN: {userEnteredPIN}</div>
		{/if}
		<br />
		{#if actual_pin === userEnteredPIN}
			<p style="color: green">Congratulations on entering the correct PIN!</p>
		{:else}
			<p style="color: red">Incorrect PIN entered, no points earned!</p>
		{/if}
		<br />
		{#await get_points()}
			<p>Fetching points...</p>
		{:then get_points_value}
			{#if get_points_value.uid !== null}
				<p style="color: green">Points: {get_points_value.points}</p>
			{:else}
				<p style="color: red">Invalid User ID!</p>
			{/if}
		{:catch error}
			{(console.log(error), '')}
			<p style="color: purple">Network Error: Unable to fetch points!</p>
		{/await}
		<br />
		<button on:click={() => (show_pin = !show_pin)}>Toggle Visibility of Entered PIN</button>
		<br />
		<button on:click={reset}>Play Again</button>
		<br />
		<button><a href="https://pinentry.net/">Checkout Other Games</a></button>

		<!-- Below is the code for the end page of the demo version of this password entry method -->
		<!--<EndPage PIN={userEnteredPIN} />
		<br>
		<button on:click={reset}>Play Again</button>-->
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		font-size: 1.2em;
	}

	h2 {
		width: 100%;
		text-align: center;
	}

	#PIN_Entry {
		min-width: 80vw;
	}
</style>
