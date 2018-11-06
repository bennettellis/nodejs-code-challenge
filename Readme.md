# Code Challenge Instructions
Write a Node script (v8 preferred) that transforms data.json into data-transformed.json. 
There is no need for any UI, it’s fine to directly read in data.json from the current 
directory. 

## Restrictions
- No for or for…of loops 
- No let or var

## General Approach & Assumptions
- Test Driven Development (TDD)
- Run from command line or
- Run in Docker container
- Assume no need to let user specify input or output files
- Assume ok to use require to load JSON based on "it's fine to directly read in data.json from the current directory."
- Assume ok to write output file directly to project directory unless otherwise specified 
- Assume no external package dependencies (only dev dependencies)
- Assume requirement to be non-blocking.
- Assume partial write on failure is acceptable (no cleanup if write fails)
- Assume no partial conversion (all or nothing output, not streamed upon completion)
- Assume schema of original data.json is stable and consistent
- Assume console.log is ok for output, no need for differentiating log levels
- Assume carriage return at the end of sample transformation file is significant
- Assume only one solution is desired, not necessarily the absolute best solution
- Assume the solution need not use any external (e.g., cloud) resources
- Assume excessive resiliency to malformed input data is not required for this solution

# Solution:
Read JSON directly from current directory, convert data async, write data async.

## Pseudo-code
1) require/import JSON from data.json file
2) map orders array to new array using OrderConverter object using Promises
3) upon completion of order conversions, write to file, notify user when done. 

#### See solution/solution.js

## Running Solution:

### Option 1: Run the tests or solution in your own Node.js environment 
To run the solution, clone this repo to your own Node.js environment. Then run `npm run start` to see the solution run.
To run the tests, you must first run `npm install`  then execute `npm run test`.

### Option 2: Run the tests or solution using the provided Dockerfile
Build a docker container using the provided Dockerfile to run the entire solution using a NodeJs container.
To run the solution from a Docker container, build the container:
```
docker build -t nodejs-code-challenge-bennett .
```
Then you can run the tests in the container:
```
docker run -t nodejs-code-challenge-bennett npm run test 
```

and/or run the solution in the container:
```
docker run -t nodejs-code-challenge-bennett npm run start 
```
If you would like to have the output of the transformation solution sent to another location, you can
map a volume to /output. For example:
```
docker run -t -v /my-local-dir:/var/lib/solution/output nodejs-code-challenge-bennett npm run start
``` 

# Verify Output
If you would like to run diff on output json compared to original data-transformed.json 
provided as part of the challenge (data-transformed-requirement.json), run:
```
diff data-transformed-requirement.json data-transformed.json
```

#Questions/Issues?
Open an issue or question in the github project. Thanks!