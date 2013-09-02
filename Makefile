
build:
	node app
test:
	mocha tests/unit/elastic.js
test api:
	mocha tests/functional/main.js
clean:
	mocha tests/maintenance/destroyDB.js
