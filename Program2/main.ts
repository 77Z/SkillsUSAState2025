import * as queryString from "node:querystring";

Deno.serve(async (request: Request) => {
	console.log(request.url);

	// Get the endpoint after host only.
	// e.g "localhost:8000/api/fibonacci/" turns into "/api/fibonacci"
	let strippedUrl = request.url;

	// Handle trailing "/"
	if (strippedUrl.endsWith("/")) strippedUrl = strippedUrl.substring(0, strippedUrl.length - 1);

	if      (strippedUrl.startsWith("http://"))  strippedUrl = strippedUrl.substring(7);
	else if (strippedUrl.startsWith("https://")) strippedUrl = strippedUrl.substring(8);

	strippedUrl = strippedUrl.substring(strippedUrl.indexOf("/"));
	

	// We only have one api endpoint, so everything else can be treated as a not
	// found error. If we add more endpoints in the future, a switch statement
	// calling outside might be a good idea

	if (!strippedUrl.startsWith("/api/fibonacci"))
		return new Response("Not found", { status: 404 });


	// Past this point we are certain the user wants to use the fibonacci
	// endpoint.

	// Do we have http query strings? This will be used to change how we parse
	// options later on, so it's useful information to have now.
	let hasUrlParameters = true;
	if (!strippedUrl.includes("?"))
		hasUrlParameters = false;

	console.log("has options:", hasUrlParameters);

	console.log("I AM HERE", strippedUrl);
	
	
	// Extract the iteration count from the url
	let iterationCount: number = 0;
	if (!hasUrlParameters) {
		// simpler when there's no options to just grab last item
		const split = strippedUrl.split("/");
		iterationCount = parseInt(split[split.length - 1]);
	} else {
		strippedUrl = strippedUrl.substring(15);
		iterationCount =
			parseInt(strippedUrl.substring(0, strippedUrl.indexOf("/")));
	}

	console.log(strippedUrl);
	console.log(iterationCount);
	
	// Includes 0 and NaN
	if (!iterationCount)
		return new Response("I don't know how many iterations to run!", { status: 400 });

	// iterationCount is checked at this point and is safe to assume is >0 and
	// is a valid number.

	strippedUrl = strippedUrl.substring(strippedUrl.indexOf("?") + 1);

	console.log(strippedUrl);

	if (!hasUrlParameters)
		return new Response(JSON.stringify({
			sequence: calculateFibonacciSequence(iterationCount)
		}), { headers: {"Content-Type": "Application/JSON"} })

	// Safe to assume that the url does have parameters at this point.

	const fibSeq: number[] = calculateFibonacciSequence(iterationCount);
	let formattedSequence: string[] = [];

	const options = queryString.parse(strippedUrl);

	if (options.help === "true") {
		return new Response(JSON.stringify({
			sequence: `
./Fibonacci-gen [-c|--count] 20 --one-line --last-only --numbering --help

Help for Fibonacci generator:

--help : Print this help
--count | -c : Calculate to this many places. IE: 0, 1, 1, 2, 3, 5 would be the result of -c 6
--one-line: Print all the numbers on one line, separated by commas. Without this option, each number in the sequence will be printer on a new line.
--numbering: Preface each number in the sequence wiht its placement: IE for "-c 6 --numbering --one-line" you would get this: "1:0, 2:1, 3:1, 4:2, 5:3, 6:5" where the first number is the count and the second is the Fibonacci sequence. Note: this argument should work with all other arguments.
--last-only: Only print the last number in the sequence`
		}), { headers: {"Content-Type": "Application/JSON"} })
	}
	
	// We overwrite the original array values if the user wants numbering
	if (options.numbering === "true")
		for (let i = 0; i < fibSeq.length; i++)
			formattedSequence.push(
				(i + 1) + ":" + fibSeq[i].toString()
			);
	else
		for (const num of fibSeq) formattedSequence.push(num.toString());

	if (options["last-only"] === "true")
		formattedSequence = [formattedSequence[formattedSequence.length - 1]];


	return new Response(JSON.stringify({
		sequence: options["one-line"] === "true"
		? formattedSequence.join(", ")
		: formattedSequence
	}), { headers: {"Content-Type": "Application/JSON"} })
});

function calculateFibonacciSequence(count: number): number[] {
	const sequence: number[] = [];
	for (let i = 0; i < count; i++) {
		// Push initial values to array to get the sequence started.
		if (i == 0) { sequence.push(0); continue; }
		if (i == 1) { sequence.push(1); continue; }

		sequence.push(
			sequence[i - 1] + sequence[i - 2]
		);
	}

	return sequence;
}