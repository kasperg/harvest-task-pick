# Harvest Task Pick

[Harvest](http://www.getharvest.com/) is great for online time tracking but I do not think it excels at the central activity: Registering time spent on a task. Harvest Task Pick is a [user script](http://wiki.greasespot.net/User_script "Definition of user script") which attempts to make time registration in Harvest more efficient.

## Installation

1. Go to [https://github.com/kasperg/harvest-task-pick/raw/master/harvest-task-pick.user.js](https://github.com/kasperg/harvest-task-pick/raw/master/harvest-task-pick.user.js)
2. Your browser or user script plugin should handle the rest. You will probably be required to accept installation of the user script.
3. Register time faster / profit!

Harvest Task Pick has been developed for Google Chrome and Firefox using [the Greasemonkey extension](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). It may work with other [browsers and plugins providing Greasemonkey compatability](http://en.wikipedia.org/wiki/Greasemonkey#Equivalents_for_other_browsers).

## Features

### Autocomplete for task selection

Harvest Task Pick replaces the dual drop downs which Harvest normally uses for time registration task selection with a single text-field supporting autocomplete.

#### Usage

1. Go to a daily timesheet in Harvest
2. Add a new entry if one is not already available.
3. Start writing the name or the client, project, short code and task or parts hereof. Separate each word with a space. Harvest Task Pick will show a list of specific tasks which match the entered words best. To register time spending on coding Harvest Task Pick for [Reload](http://reload.dk) I might enter *re pick code*
5. Use the arrow keys to navigate between suggestions and hit enter or tab to select. Focus will automatically jump to the time field.
6. Enter time and/or notes as normal

Harvest Task Pick does currently not modify:

- Weekly timesheets
- Editing tasks on daily timesheets

## Development notes

I have put a lot of effort in trying to make the same code run in both Chrome and Firefox/Greasemonkey. As the implementation of user scripts is quite different between browsers this has so far resulted in a minimal user script which mainly consists of meta data and custom methods for injecting the task picker and external dependencies like jQuery into the DOM and ensuring execution order.

Chrome and Firefox refuse to interpret CSS files located in GitHub repositories. This is probably because they are served with  content type text/plain instead of text/css. Consequently I have introduced a build process which parses the `harvest-task.pick.user.src.js` file, look for `/* styles(url) */` declarations and replace the comment with the content of the file hosted at the url and write the result to `harvest-task-pick.usr.js`.

The build process also adds minor version numbers to the resulting user script based on the current date and time.

Building Harvest Task Pick requires PHP available from the command line and is executed using `php build.php` from the Harvest Task Pick root directory.

## Versions 

- *0.3*:
  - Fixed Javascript and CSS includes: Refactored Javascript loading and introduced build system for CSS includes
  - Prevent Harvest Task Pick from executing multiple times for the same element
  - Improved Chrome domain matching and security warning: Use @match in metadata block.
  - Added MIT license and README
- *0.2*:
  - Faster workflow: Activate first autocomplete suggestion, jump to next field on enter
  - Support for extended character sets: Use whitespace as task word delimiter instead of ^\da-z
  - Attempts to fix load and execution order
- *0.1*: Initial version. 

## Credits

A lot of the autocomplete magic is provided by Clint Tsengs [awesomecomplete jQuery plugin](https://github.com/clint-tseng/awesomecomplete).
