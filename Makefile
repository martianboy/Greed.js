.PHONY: clean build dist

build:
	./Makefile.dryice.js
	cp build/Grid.js demo/js/

clean:
	rm -rf build
	rm demo/js/Grid.js

dist: clean build
