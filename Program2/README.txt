This is a typescript program using the Deno runtime. There is a modern Linux
x86_64 binary in the directory that runs just like a normal program would, but
it can also be run with:

deno run --allow-all main.ts

The binary was compiled with:

deno compile --allow-all main.ts

installing node type definitions for typescript is required to run this program
(in the development mode, the compiled binary does NOT need any deps). Use
`npm i` or `deno install` in the root of the repo to pull that package.