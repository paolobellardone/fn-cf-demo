# fn-cf-demo

## cf

This directory contains a Javascript (Node) function to evaluate the Italian Fiscal code given the details of a person.

This function has to be deployed on a fn server, see <http://fnproject.io>

Quickstart:

1. fn start

    > Starts a new fn server (not for production)

2. fn create app cfapp

    > Create a new app to deploy functions into it

3. fn deploy --app cfapp --local

    > Deploy the new app into the fn server

4. Test the function

    > curl -X "POST" -H "Content-Type: application/json" --data @sample.payload.json <http://localhost:8080/t/cfapp/cf>

## ojetcfdemo

This directory contains a Oracle Jet application that invokes the previous function.

The application can be run standalone using the command: *ojet serve* or can be deployed in a Docker container using the included Dockerfile.

If yoou want to create a Docker image, please run *npm install* before creating the image.
