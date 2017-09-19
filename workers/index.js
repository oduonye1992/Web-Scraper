var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


function Scraper(){
    var parseLink = function(link, selector){
        /**
         * Look for those whose parents is the ID
         */
        var children = configuration.selectors.filter(function(current){
            return current.parentSelectors.indexOf(selector.id) > -1
        });
        children.forEach(function(child){
            scrape(link, child);
        });
    };
    var parseText = function(text, selector){
        console.log(text);
    };
    var scrape = function(url, sel){
        //console.log("Start with "+url);
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                configuration.selectors.forEach(function(selector){
                    if (selector.type === 'SelectorLink'){
                        if (selector.multiple){
                            if ($(selector.selector).length){
                                for (var i = 0; i < $(selector.selector).length; i++){
                                    var link = $(selector.selector+':nth-of-type('+i+')').attr('href');
                                    if (link){
                                        console.log(link);
                                        parseLink(link, selector);
                                    }
                                }
                            }
                        }
                    } else if (selector.type === 'SelectorText'){
                        if ($(selector.selector).length){
                            for (var j = 0; j < $(selector.selector).length; j++){
                                var s = $(selector.selector+':nth-of-type('+j+')').html();
                                console.log(s);
                                parseText(s, selector);
                            }
                        } else {
                            console.log('evaluating'+url);
                        }
                    }
                });
                return false;
            }
        })
    };
    var configuration = {"startUrl":"http://www.nairaland.com/cartalk","selectors":[{"parentSelectors":["_root"],"type":"SelectorLink","multiple":true,"id":"pages","selector":"div.body > p:nth-of-type(3) a","delay":""},{"parentSelectors":["pages"],"type":"SelectorLink","multiple":true,"id":"topic","selector":"tr:nth-of-type(n+2) a:nth-of-type(1)","delay":""},{"parentSelectors":["topic"],"type":"SelectorText","multiple":true,"id":"comment","selector":"td#pb11518040.l div.narrow","regex":"","delay":""}],"_id":"auto_insurance"}
    url = configuration.startUrl;
    scrape(url);
}
try {
    Scraper();
} catch (e) {
    console.log(e);
}

app.listen('8072');
console.log('Magic happens on port 8072');

exports = module.exports = app;