
build:
	node app
test:
	mocha tests/unit/elastic.js
test_api:
	mocha tests/functional/main.js
