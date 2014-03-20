draino
======

Heroku logplex drain framework for node.js

This repo is a work in progress / spike of the following processing
architecture:

<pre>
  +------+                   +-------------------+                +-------+
  | App  |   +------+        |                   |       STDIN    |       |
  +------+   | App  |    +--&gt;|      Draino       |+--------------&gt;|Filter |
   +         +------+    |   |                   |                |       |
   |STDOUT     +         |   +-------------------+                +-------+
   |           |STDOUT   |                 +
   v           v         |                 |
 +---------------+       |HTTP(S)          |        +-------+
 |               |       |                 | STDIN  |       |
 | h drains:add  |+------+                 +-------&gt;|Filter |
 |               |                                  |       |
 +---------------+                                  +-------+
      ^        ^
      |STDOUT  |
      +        |
     +------+  |          +------+
     | App  |  +--------+ | App  |
     +------+   STDOUT    +------+</pre>



