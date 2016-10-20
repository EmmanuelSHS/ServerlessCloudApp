# Simple Ebase

## Description

Serverless Ebase with AWS Dynamo DB, Lambda and API Gateway. 
Course Project for CU E6998 Modern Serverless Cloud App.
Allowing Administrative Personnel to manage customer and related address data.

## Usage

run:
    ./startserver.sh

then local server will be run in localhost:8000.


For sake of demo for project, we host a web app on a server, the address of which will be provided in submission.

## User Story

* Simple Ebase is mostly designed for purpose of customer info management for adminstrative personnel in United States.

* Administrative person can add customter info (firstname, lastname, phone, email), address info (street, apt number, city, zipcode) to DyanmoDB.

* Administrative person can update customer info, and corresponding address info.
 
* Administrative person can retrieve info.
 
* Administrative person can delete customer info records in DyanmoDB.
 
* Address can be auto-validated with SmartyStreet API.


## Repo Structure

The repo structure is as:
    
    main/
    |
    |-- app/ front-end codes
    |
    |-- src/ back-end codes in AWS Lambda
    |
    |-- log/ log repo for running web server 
    |
    |-- startserver.sh shell script for hosting server with Python pkg
    |
    |-- index.html html templates entry point

## TODO

* prettify the front-end
