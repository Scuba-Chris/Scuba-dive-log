# Scuba-dive-log

Created by:
Chris Ceder

___

###Description

My app creates and a scuba dive log for the user. It stores each of the users dive ( dive #, max depth, duration, location, gear config., dive buddy). 

---

###Problem domain

There are a few different ways someone could store their dive log information. There are a few different apps and even paper log books available. These apps can be a bit buggy or not save all of the information from the dive that many techical divers would want.

---

###User Stories

As a scuba diver, I want to be able to save all of the data from each of my dives. I want it to save the dive number, date, max depth, duration, locations, gear configuration/used, dive buddy.

As the frontend developer, I want to be able to make a website that displayes the users dive log in a clear and user friendly way. EJS will be use to render all of the data onto the page. I will use a form to take in the dive data from the user. That data will then be sent to the backend(POST). 

As the backend developer, I need to create a SQL to store the data. The data will be stored in a table(rows: dive_num, date, max depth, duration, location(lat, long), gear configuration/used, dive buddy). From 
