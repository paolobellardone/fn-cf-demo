# fn-cf-demo
### cf
This directory contains a Javascript (Node) function to evaluate the Italian Fiscal code given the details of a person.
This function has to be deployed on a fn server, see http://fnproject.io

### ojetcfdemo
This directory contains a Oracle Jet application that invokes the previous function.
The application can be run standalone using the command: *ojet serve* or can be deployed in a Docker container using the included Dockerfile.
If yoou want to create a Docker image, please run *npm install* before creating the image.
