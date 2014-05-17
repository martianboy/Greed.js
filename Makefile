.PHONY: clean build dist

build:
	./Makefile.dryice.js
	cp build/Greed.js demo/js/

clean:
	rm -rf build
	rm demo/js/Greed.js

dist: clean build
