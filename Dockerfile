FROM node:12

RUN mkdir /code
COPY ./ /code
WORKDIR /code
EXPOSE 3000
CMD node_modules/nodemon/bin/nodemon.js -r esm prApi.js

