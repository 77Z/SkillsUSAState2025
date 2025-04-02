import { parse } from "https://deno.land/std@0.192.0/flags/mod.ts";

// Beginning portion is all about parsing the basic cli flags the user wants and
// just setting up the program.

const cliFlags = parse(Deno.args, {
	boolean: ["help", "one-line", "numbering", "last-only"],
	string: ["c", "count"]
})

if (cliFlags.help) {
	console.log(`
./Fibonacci-gen [-c|--count] 20 --one-line --last-only --numbering --help

Help for Fibonacci generator:

--help : Print this help
--count | -c : Calculate to this many places. IE: 0, 1, 1, 2, 3, 5 would be the result of -c 6
--one-line: Print all the numbers on one line, separated by commas. Without this option, each number in the sequence will be printer on a new line.
--numbering: Preface each number in the sequence wiht its placement: IE for "-c 6 --numbering --one-line" you would get this: "1:0, 2:1, 3:1, 4:2, 5:3, 6:5" where the first number is the count and the second is the Fibonacci sequence. Note: this argument should work with all other arguments.
--last-only: Only print the last number in the sequence`);
	Deno.exit(1);
}

const count: number = parseInt(cliFlags.c!) | parseInt(cliFlags.count!);

if (!count) {
	console.error("I don't know how many iterations to run! Bailing out");
	Deno.exit(1);
}

// This is the fibonacci sequence algorithm for the program.

const sequence: number[] = [];
for (let i = 0; i < count; i++) {
	// Push initial values to array to get the sequence started.
	if (i == 0) { sequence.push(0); continue; }
	if (i == 1) { sequence.push(1); continue; }

	sequence.push(
		sequence[i - 1] + sequence[i - 2]
	);
}

// And this final part is where we format and output the fibonacci sequence
// according to the user's cli flags.

const formattedSequence: string[] = [];

// We overwrite the original array values if the user wants numbering
if (cliFlags.numbering)
	for (let i = 0; i < sequence.length; i++)
		formattedSequence.push(
			(i + 1) + ":" + sequence[i].toString()
		);
else
	for (const num of sequence) formattedSequence.push(num.toString());


// Various output styles are here.

if (cliFlags["last-only"]) {
	console.log(formattedSequence[formattedSequence.length - 1]);
	Deno.exit(0);
}

if (cliFlags["one-line"]) {
	let output: string = "";

	for (let i = 0; i < formattedSequence.length; i++) {
		output += formattedSequence[i];
		if (i !== formattedSequence.length - 1) output += ", ";
	}

	console.log(output);
	Deno.exit(0);
}

// User hasn't specified the kind of formatting they'd like, so it will be
// printed on new-lines

for (const num of formattedSequence) console.log(num);