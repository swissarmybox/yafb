clean-client:
	cd client && rm -rf node_modules && rm -rf build

clean-server:
	cd server && rm -rf node_modules && rm -rf build

clean: clean-client client-server
	rm -rf dist

bootstrap-client:
	cd client && npm install

bootstrap-server:
	cd server && npm install

bootstrap: bootstrap-client bootstrap-server

test-client:
	cd client && npm test

test-server:
	cd server && npm test

test: test-client test-server

lint-client:
	cd client && npm run lint:fix

lint-server:
	cd server && npm run lint:fix

lint: lint-client lint-server

start-client:
	cd client && npm start

start-server:
	cd server && npm start

build-client:
	cd client && npm run build

build-server:
	cd server && npm run build

build: build-client
	rm -rf dist
	mkdir dist
	mv client/build dist/public 
	mv client/build dist/ 
	cp server/package.json dist/
	cp server/package-lock.json dist/
	cd dist && npm install --only=production
