##
# redirect-to-abstract
#
# @file
# @version 0.1

.PHONY: build clean package watch purge install

package: clean move-static build
	mkdir -p extension && cd extension && zip -r redirect-to-abstract.zip *

clean:
	rm -rf extension/*

purge: clean
	rm -rf output && rm -rf node_modules && rm -rf bower_components

nuke: purge
	git clean -fx

move-static:
	mkdir -p extension && cp -f static/* extension/

build: extension/content.js extension/background.js

extension/content.js:
	mkdir -p extension && browserify js/content.js > extension/content.js

extension/background.js:
	mkdir -p extension && browserify js/background.js > extension/background.js

install: extension/redirect-to-abstract.zip

extension/redirect-to-abstract.zip: extension/content.js extension/background.js
	cd extension && zip -r redirect-to-abstract.zip *

# end
