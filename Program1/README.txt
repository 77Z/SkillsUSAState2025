This is a typescript program using the Deno runtime. There is a modern Linux
x86_64 binary in the directory that runs just like a normal program would, but
it can also be run with:

deno run --allow-all main.ts [arguments]

The binary was compiled with:

deno compile --allow-all main.ts