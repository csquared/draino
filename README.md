draino
======

Heroku logplex drain framework for node.js

This repo is a work in progress / spike of the following processing
architecture:

<pre>
  +------+                            +-------------------+                +-------+
  | App  |   +------+       HTTP(S)   |                   |     STDIN      |       |
  +------+   | App  |    +-----------&gt;|      Draino       |+--------------&gt;|Filter |
   +         +------+    |            |                   |&lt;--------------+|       |
   |STDOUT     +         |            +-------------------+     STDOUT     +-------+
   |           |STDOUT   |                  ++        ^  +
   v           v         |                  ||        |  |
 +---------------+       |                  ||        |  |
 |               |       |                  ||        |  | STDIN  +-------+
 | h drains:add  |+------+                  ||        |  +-------&gt;|       |
 |               |                          vv        |           |Filter |
 +---------------+                        STDOUT      +----------+|       |
      ^        ^                                           STDOUT +-------+
      |STDOUT  |
      +        |
     +------+  | STDOUT   +------+
     | App  |  +--------+ | App  |
     +------+             +------+</pre>


All you have to do is write the filters, which are any UNIX program that can parse JSON.

Draino spawns everything in the ./filters directory and pipes log data into STDIN as one
JSON object per line.

## Modes


## usage

    npm install draino

### `-f` single filter

    draino -f path/to/filter

### `-d` directory of filters

    draino -f path/to/filter

### `--heroku` normalize logplex metadata to logfmt

    draino -f path/to/filter --heroku

### `--logfmt` parse logfmt logs and emit JSON

    draino -f path/to/filter --heroku --logfmt
