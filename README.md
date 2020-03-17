# fn-cf-demo
### cf
This directory contains a Javascript (Node) function to evaluate the Italian Fiscal code given the details of a person.

This function has to be deployed on a fn server, see http://fnproject.io

Quickstart:
1. fn start
  * Starts a new fn server (not for production)
2. fn create app cfapp
  * Create a new app to deploy functions into it
3. fn deploy --app cfapp --local
  * Deploy the new app into the fn server
4. fn inspect function cfapp cf
  * Get the URL to invoke the function


### ojetcfdemo
This directory contains a Oracle Jet application that invokes the previous function.

Please update the url parameter in file main.js @ line 53 to reflect the new invoke URL got in the prvious step.

The application can be run standalone using the command: *ojet serve* or can be deployed in a Docker container using the included Dockerfile.

If yoou want to create a Docker image, please run *npm install* before creating the image.
