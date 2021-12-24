# Django Model Tool

*This project is under develop, use at your own risk*

This extension is to assist in the generation of the boilerplate code used for tools like the Django Admin. It utilized the symbol engine used to generate document outlines to scrape out Django models.

## Features

* Generates basic ModelAdmins

## Goals

* Better ModelAdmin
* Generation of DRF Serializers
* Generation of GQL Inputs Types
* Basic list insert of class members for bodging purposes
* Customizable Templates
* Smarter ordering of models based on currently opened files

## Known issues

If VS Code hasn't had a chance to analyse the workspace the symbol search fails silently. If the model select is empty, make sure the document outline loaded.