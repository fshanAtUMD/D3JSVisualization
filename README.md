# D3JSVisualization

**Import Data**: 
   * Unzip flight-delays.zip in ./database directory.
   * python3 db_setup.py

**Run Server**: python3 server.py

**Port**: 5000

**Webpage**: http://localhost:5000

There are about 5 million records so it will take some time to query and render.
   
   
##Design:
The visualization is designed to explore flight delays data over different states. The first step is aggregation in order to get a sense of the amount of records for each state. Therefor I first designed the map with total amount of records group by states, and chose brightness of red color channel to express it. Potentially there are other color channels available. But when I decided to also display total airport of each state, I decided to use hue to distinguish records and airports, and use brightness for the number of records or airports.

The other visualization is a bar chart displaying average delay records in one airport of the state grouped by days of week, which is more intuitive than simply displaying number of records without considering number of airports located in one state. An alternative design could be scatter plot of records and airports, however my design provides information about the delay situation over one week. As the color, I chose green to make the overall display more balanced. 

##Development:
I'm trying to visualize in a map and it took me some time looking for suitable dataset and connect data with corresponding area. To fully understand the full-stack workflow, syntax of visualization libraries and debugging front-end is also time consuming. Overall I might took 40 hours to finish this assignment. However I think it's necessary and helpful for CS students to understand and practice full-stack development. 

##Improvement:
I used minimal libraries to develop this application. It would be necessary to boost the back-end query execution. And with dc.js and crossfilter.js, the visualization development might be more efficient.

