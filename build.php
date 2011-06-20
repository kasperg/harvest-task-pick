<?php

/**
 * Harvest Task Pick build script
 *
 * Compiles external resources into a user script to avoid relying
 * on external resources. Support for external resources is inconsistent
 * across browsers (Firefox, Chrome) so we include them directly inside
 * the user script instead.
 *
 * Usage: php build.php
 */

// Load the source script
$src = file_get_contents(__DIR__.'/harvest-task-pick.user.src.js');

function insert_resource($matches) {
  list($replace, $mode, $resource) = $matches;
  
  // Load the external resource
  $resource = file_get_contents($resource);

  // If styles are included they will be used inside a string but span
  // multiple lines each line break should be preceeded by a \.
  // See http://snook.ca/archives/javascript/multi-line-javascript.
  if ($mode == 'styles') {
    $resource = str_replace("\n", "\\\n", $resource);
  }
  
  return $resource;
}

// Detect, load and replace external resources with local declarations
$src = preg_replace_callback('|/\*\s*(\w+)\((.*?)\)\s*\*/|', 'insert_resource', $src);

// Write the compiled user script
file_put_contents(__DIR__.'/harvest-task-pick.user.js', $src);