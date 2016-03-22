# CKEditor Media Embed Plugin

A module that register the Media Embed CKEditor plugin: http://ckeditor.com/addon/embed

## Installation

Install per normal https://www.drupal.org/documentation/install/modules-themes/modules-8.

## Configuration

* Install and enable [CKEditor media embed](https://www.drupal.org/project/ckeditor_media_embed) module.
* Go to the 'Text formats and editors' configuration page: `/admin/config/content/formats`, and for each text format/editor combo where you want to embed URLs, do the following:
  * Drag and drop the 'Media Embed' or the 'Semantic Media Embed' button into the Active toolbar.
  * If the text format uses the 'Limit allowed HTML tags and correct faulty HTML' filter, use the 'Semantic Media Embed' and read the instructions for the 'Semantic Media Embed' below.

### Semantic Media Embed

If you are using the 'Semantic Media Embed' button be sure to do the following:
* Enable the 'Convert Oembed tags to media embeds' filter.
* If the text format uses the 'Limit allowed HTML tags and correct faulty HTML' filter, add ```<oembed>``` to the 'Allowed HTML tags' field. (This should happen automatically however, in some cases it does not. See https://www.drupal.org/node/2689083.)

## Additional plugins

This module also includes all additional non-core depdencies for the Media Embed CKEditor plugin.

* [Media Embed](http://ckeditor.com/addon/embed)
* [Media Semantic Embed](http://ckeditor.com/addon/embedsemantic)
* [Media Embed Base](http://ckeditor.com/addon/embedbase)
* [Auto Embed](http://ckeditor.com/addon/autoembed)
* [Auto Link](http://ckeditor.com/addon/autolink)
* [Notification](http://ckeditor.com/addon/notification)
* [Notification Aggregator](http://ckeditor.com/addon/notificationaggregator)
