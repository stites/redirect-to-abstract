##
# redirect-to-abstract
#
# @file
# @version 0.1

.PHONY: build clean package watch purge install test

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

test:
	firefox \
		https://arxiv.org/pdf/2005.09089.pdf \
		https://openreview.net/pdf?id=Mk6PZtgAgfq \
	  https://aclanthology.org/2021.findings-acl.30.pdf \
	  https://proceedings.neurips.cc/paper/2016/file/40008b9a5380fcacce3976bf7c08af5b-Paper.pdf \
	  https://www.ijcai.org/Proceedings/15/Papers/263.pdf \
	  https://www.biorxiv.org/content/10.1101/2022.11.23.517739v2.full.pdf

# end
