clean-server:
	cd server && rm -rf build

clean-client:
	cd client && rm -rf build

clean: clean-server clean-client
	rm -rf dist

bootstrap-server:
	cd server && npm install

bootstrap-client:
	cd client && npm install

bootstrap: bootstrap-server bootstrap-client

test-server:
	cd server && npm test

test-client:
	cd client && npm test

test: test-server test-client

lint-server:
	cd server && npm run lint:fix

lint-client:
	cd client && npm run lint:fix

lint: lint-server lint-client

dev-server:
	cd server && npm start

dev-client:
	cd client && npm start

dev: dev-server dev-client

build-server:
	cd server && npm run build

build-client:
	cd client && npm run build

build: build-server build-client
	rm -rf dist
	mkdir dist
	mv client/build dist/client 
	mv server/build dist/server 
	cp server/{package.json,package-lock.json} dist/
	cd dist && npm install --only=production
	rm dist/{package.json,package-lock.json}

prod:
	NODE_ENV=production node dist/server/index.js
