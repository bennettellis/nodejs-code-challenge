FROM node:10-alpine

# only copy over what is needed for solution
WORKDIR /var/lib/solution
COPY solution.js .
COPY order-converter.js .
COPY package*.json ./
COPY data.json .
COPY data-transformed-requirement.json .
COPY test.js .

# install dev dependencies to be able to run tests in container
RUN npm install

# place where ouptut file will go
VOLUME /var/lib/solution/output
ENV CHALLENGE_OUTPUT_DIR /var/lib/solution/output

# run the solution by default
CMD ["sh", "-c", "npm run start && sh"]
