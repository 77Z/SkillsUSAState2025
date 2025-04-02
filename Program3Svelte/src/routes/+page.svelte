<script lang="ts">

	interface Student {
		programmingScore : number;
		artScore         : number;
		scienceScore     : number;
		mathScore        : number;
		historyScore     : number;
	}

	interface ClassScoreReport {
		name                : string;
		numScoresCalculated : number;
		average             : number;
		highScore           : number;
		lowScore            : number;
	}

	// Global data stores
	let classSummaries: ClassScoreReport[] = [];
	let students: Student[] = [];
	let activeError = "";

	function createStudent() {
		students.push({
			programmingScore: 0,
			artScore: 0,
			scienceScore: 0,
			mathScore: 0,
			historyScore: 0,
		});

		// Svelte catches assignments for reactivity, so .push doesn't update
		// the table alone.
		students = students;
	}

	function deleteStudent(index: number) {
		students.splice(index, 1);
		students = students;
	}

	function resetAll() {
		students = [];
		classSummaries = [];
		activeError = "";
	}

	function generateSummary() {
		classSummaries = [];

		if (!students.length) {
			activeError = "No students entered into system.";
			return;
		}

		// Check for negative scores and empty values.
		for (const student of students) {
			for (const score of Object.values(student)) {
				if (typeof score !== "number") {
					activeError = "Scores must be valid numbers.";
					return;
				}

				if (score < 0 || score > 100) {
					activeError = "Scores must be within 0-100 points.";
					return;
				}
			}
		}

		// One pass of students per class

		{ // Calc programming scores
			let scores: number[] = [];
			for (const student of students) scores.push(student.programmingScore);
			classSummaries.push(calculateSingleClassSummary(scores, "Programming"));
		}

		{ // Calc art scores
			let scores: number[] = [];
			for (const student of students) scores.push(student.artScore);
			classSummaries.push(calculateSingleClassSummary(scores, "Art"));
		}

		{ // Calc science scores
			let scores: number[] = [];
			for (const student of students) scores.push(student.scienceScore);
			classSummaries.push(calculateSingleClassSummary(scores, "Science"));
		}

		{ // Calc math scores
			let scores: number[] = [];
			for (const student of students) scores.push(student.mathScore);
			classSummaries.push(calculateSingleClassSummary(scores, "Math"));
		}

		{ // Calc history scores
			let scores: number[] = [];
			for (const student of students) scores.push(student.historyScore);
			classSummaries.push(calculateSingleClassSummary(scores, "History"));
		}

		classSummaries = classSummaries;
		activeError = "";
	}

	// This method does the calculations for a single generic class, and relies
	// on its caller to keep track of what class it's working on.
	function calculateSingleClassSummary(scores: number[], className: string): ClassScoreReport {
		let avg = 0;
		for (const score of scores) avg += score;
		avg /= scores.length;
		
		return {
			name: className,
			numScoresCalculated: scores.length,
			average: Math.round(avg),
			highScore: Math.max(...scores),
			lowScore: Math.min(...scores),
		};
	}
</script>

<title>Grade Program</title>

<h1>Contestant #1443 - Program #3 - Grade Program</h1>

{#if activeError.length !== 0}
	<div id="errorBox">{ activeError }</div>
{/if}

<hr>

<button on:click={createStudent}>+ Add Student</button>
<button on:click={resetAll}>Reset All</button>

{#if students.length !== 0}
	<table>
		<thead>
			<tr>
				<th scope="col">Student</th>
				<th scope="col">Programming</th>
				<th scope="col">Art</th>
				<th scope="col">Science</th>
				<th scope="col">Math</th>
				<th scope="col">History</th>
			</tr>
		</thead>
		<tbody>
			{#each students as student, i}
				<tr>
					<th scope="row">Student {i + 1}</th>
					<td><input type="number" bind:value={student.programmingScore} /></td>
					<td><input type="number" bind:value={student.artScore} /></td>
					<td><input type="number" bind:value={student.scienceScore} /></td>
					<td><input type="number" bind:value={student.mathScore} /></td>
					<td><input type="number" bind:value={student.historyScore} /></td>
					<td><button class="clearBtn" on:click={() => deleteStudent(i)}>×</button></td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<hr>
<button on:click={generateSummary}>Calculate Summary</button>

<div class="summaries">
	{#each classSummaries as summ}
		<div class="summary">
			<h1>{summ.name}</h1>
			<span>Number of Scores Entered: {summ.numScoresCalculated}</span>
			<span>Average: {summ.average}</span>
			<span>High Score: {summ.highScore}</span>
			<span>Low Score: {summ.lowScore}</span>
		</div>
	{/each}
</div>

<style>
	#errorBox {
		border: 3px solid red;
		border-radius: 10px;
		background: #ff000050;
		padding: 15px;
	}

	table {
		/* border: 1px solid black; */
		width: 100%;
	}

	th {
		min-width: 90px;
		/* border: 1px solid black; */
	}

	input[type=number] {
		width: 90%;
	}

	.summaries {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 10px;
	}

	.summary {
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		flex-grow: 1;
		box-shadow: 0 0 5px #0000008a;
		box-sizing: border-box;
		padding: 10px;
	}

	.summary h1 {
		margin: 0;
	}

	.clearBtn {
		padding: 0;
		border-radius: 1000px;
		font-size: 20px;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f00;
	}
</style>