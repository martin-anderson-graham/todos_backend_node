## Welcome to my todo app

### Considerations and decisions - 
  - I chose to re-render the page (nav, content, etc) so that I could add event listeners to containing divs rather than the whole document and not have them overwritten
  - I chose not to use return values from the API - rather I just got the full list of todos anytime I needed to redraw the page
  - I chose to locate page redraw functionality in the `View` object as I was always storing the current `due_date` on the `View` object.  The `Controller` invoked the necessary methods on `View` (as opposed to having the `Model` do so) after the `Model` methods have returned
  - Since we are using the same form for submitting and editing todos I added a data attribute to the form whether we are editing or creating a todo
  - I made the 'Mark as Complete' button toggle the completion state.
  - The API for updating a todo says that fields not provided retain their prior values.  This seems to mean to me that it is impossible to remove optional fields (such as the description or date fields).   Submitting empty strings seems to be rejected by the API and preserve former values.  The reference app does allow for removing optional fields, but if I am reading the script for the app correctly it is not utilizing the same API we are.

### Utility functions 
In the browser console run :
  - `resetDatabase()` to reset the database using the API specified in the docs
  - `dummyData()` to populate the database with the object specified in `/public/javascripts/dummydata.js`