draino
======

Heroku logplex drain framework for node.js

This repo is a work in progress / spike of the following processing
architecture:

<pre>
  +------+                            +-------------------+                +-------+
  | App  |   +------+       HTTP(S)   |                   |       STDIN    |       |
  +------+   | App  |    +-----------&gt;|      Draino       |+--------------&gt;|Filter |
   +         +------+    |            |                   |                |       |
   |STDOUT     +         |            +-------------------+                +-------+
   |           |STDOUT   |                          +
   v           v         |                          |
 +---------------+       |                          |        +-------+
 |               |       |                          | STDIN  |       |
 | h drains:add  |+------+                          +-------&gt;|Filter |
 |               |                                           |       |
 +---------------+                                           +-------+
      ^        ^
      |STDOUT  |
      +        |
     +------+  | STDOUT   +------+
     | App  |  +--------+ | App  |
     +------+             +------+</pre>

All you have to do is write the filters, which are any UNIX program that can parse JSON.

Draino spawns everything in the ./filters directory and pipes log data into STDIN as one
JSON object per line.
