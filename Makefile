build:
	node app
test:
	mocha tests/unit/elastic.js
	mocha tests/unit/index_bulk.js
test_api:
	mocha tests/functional/main.js
clean:
	mocha tests/maintenance/destroyDB.js
setup:
	mocha tests/maintenance/setupDB.js
everything:
	make clean && make setup && make test && make test_api && make build