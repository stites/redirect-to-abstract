##
# redirect-to-abstract
#
# @file
# @version 0.1

.PHONY: build clean package watch purge install

package: clean
	make build && make install

clean:
	rm -rf extension/*

purge: clean
	rm -rf output && rm -rf node_modules && rm -rf bower_components

nuke: purge
	git clean -fx

build: extension/content.js extension/background.js extension/manifest.json

extension/manifest.json:
	mkdir -p extension && cp -f static/* extension/

extension/content.js:
	mkdir -p extension && browserify js/content.js > extension/content.js

extension/background.js:
	mkdir -p extension && browserify js/background.js > extension/background.js

install: extension/redirect-to-abstract.zip

extension/redirect-to-abstract.zip: extension/content.js extension/background.js
	cd extension && zip -r redirect-to-abstract.zip *

# end
