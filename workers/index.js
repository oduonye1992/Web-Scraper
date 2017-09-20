var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

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
    /**
     *
     * @param url
     * @param sel
     * Build Graph
     * Get the root node (parentSelectors includes "_root")
     *
     */
    var buildGraph = function(){
        var graph = [];
        configuration.selectors.forEach(function(selector){
            var id = selector.id;
            configuration.selectors.forEach(function(sel){
                if (sel.parentSelectors.indexOf(id) > -1){
                    graph.push({
                        parent : id,
                        child : sel.id
                    });
                }
            })
        });
        return graph;
    };
    var getNode = function(id){
        for (var i =0; i < configuration.selectors.length; i++){
            if (configuration.selectors[i].id === id){
                return configuration.selectors[i]
            }
        }
        throw new Error(id + ' not found');
    };
    var getChildren = function(id) {

    }
    var begin = async(function(){
        var graph = buildGraph();
        if (graph.length){
            var baseIndex = 0;
            var html = await(loadPage(configuration.startUrl));
            evaluate(graph, baseIndex, html);
        }
    });

    var evaluate = async(function(graph, index, html){
        if (index >= graph.length) {
            return console.log("Done");
        }
        var node = graph[index];
        var parent = getNode(node.parent);
        var children = getChildren(parent.id);
        var $ = cheerio.load(html);
        //console.log(parent);
        if (parent.type === 'SelectorLink'){
            if (parent.multiple){
                console.log('Length of selector '+parent.selector+' '+$(parent.selector).length);
                if ($(parent.selector).length){
                    for (var i = 0; i < $(parent.selector).length; i++){
                        var link = $(parent.selector+':nth-of-type('+i+')').attr('href');
                        if (link){
                            console.log(link);
                            // fetch link
                            var html = await(loadPage(configuration.startUrl));
                            evaluateChild(html, node.child);
                            //parseLink(link, selector);
                        }
                    }
                }
            }
        } else if (parent.type === 'SelectorText'){
            return console.log('Selector is text');
            if ($(parent.selector).length){
                for (var j = 0; j < $(parent.selector).length; j++){
                    var s = $(parent.selector+':nth-of-type('+j+')').html();
                    console.log(s);
                    parseText(s, parent);
                }
            } else {
                console.log('evaluating'+url);
            }
        }
    });
    var evaluateChild = function(html, id){
        var child = getNode(id);
    };

    var loadPage = function(url){
        return new Promise(function(resolve, reject){
            console.log('Evaluating '+url);
            request(url, function(error, response, html){
                if(!error){
                    resolve(html);
                } else {
                    reject(error);
                }
            })
        });
    };


    var scrape = function(url, sel){
        //console.log("Start with "+url);
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                console.log('body is '+$('body').html());
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
    var configuration = {"_id":"nairaland","startUrl":"http://www.nairaland.com/","selectors":[{"parentSelectors":["_root"],"type":"SelectorLink","multiple":true,"id":"topics","selector":"td.featured a","delay":""},{"parentSelectors":["topics"],"type":"SelectorText","multiple":true,"id":"comments","selector":"blockquote","regex":"","delay":""}]}
    url = configuration.startUrl;
    //scrape(url);
    //start();
    begin();
}
try {
    Scraper();
} catch (e) {
    console.log(e);
}

app.listen('8072');
console.log('Magic happens on port 8072');

exports = module.exports = app;