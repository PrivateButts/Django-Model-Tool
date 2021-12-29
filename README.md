# Django Model Tool

*This project is under develop, use at your own risk*

This extension is to assist in the generation of the boilerplate code used for tools like the Django Admin. It utilized the symbol engine used to generate document outlines to scrape out Django models.

## Features

* Generates basic ModelAdmins

## Configuration Options

All keys live under `django-model-tool`

Key                      | Type             | Description
-------------------------|------------------|------------
PreferModelsInSameFolder | Boolean          | When a model picker will be displayed, setting this option to true will cause models in the same folder as the active document to be pushed to the top of the list.
FieldListNewLines        | Boolean          | When using the basic model field list generator, render each item on a new line
FieldListSingleQuote     | Boolean          | When using the basic model field list generator, render each item surrounded in single quotes instead of double
templates.modelAdmin     | Multiline String | The template rendered for Model Admin generation. [Refer to this doc page for more information.](https://github.com/PrivateButts/Django-Model-Tool/blob/main/docs/templates.md#model-admin)

## Goals

* Better ModelAdmin
* Generation of DRF Serializers
* Generation of GQL Inputs Types
* Error messages
* ~~Basic list insert of class members for bodging purposes~~
* ~~Customizable Templates~~
* ~~Smarter ordering of models based on currently opened files~~

## Known issues

If VS Code hasn't had a chance to analyse the workspace the symbol search fails silently. If the model select is empty, make sure the document outline loaded.