var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

function Scraper(conf){
    var configuration = conf;
    var scrapeData = [];
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
    var getChildrenForNode = function(nodeID){
        return configuration.selectors.filter(function(sel){
            return sel.parentSelectors.indexOf(nodeID) > -1
        });
    };
    var analyzeNode = function(html, node, dataObj) {
        return new Promise(async (function(resolve, reject) {
            var $ = cheerio.load(html);
            if (node.type === 'SelectorLink'){
                if (node.multiple){
                    if ($(node.selector).length){
                        console.log($(node.selector).length);
                        for (var i = 0; i < $(node.selector).length; i++){
                            var sel = $(node.selector+':nth-of-type('+i+')');
                            var link = sel.attr('href');
                            var linkText = sel.html();
                            if (link){
                                //console.log(node.selector + ' | ' +html.substr(0, 100));
                                dataObj[node.id] = linkText;
                                dataObj[node.id+'_href'] = link;
                                var linkHtml = await(loadPage(link));
                                getChildrenForNode(node.id).forEach(async(function(childNode){
                                    await(analyzeNode(linkHtml, childNode, dataObj));
                                }));
                            } else {
                                scrapeData.push(dataObj);
                            }
                        }
                        resolve();
                    }
                }
            } else if (node.type === 'SelectorText') {
                if (node.multiple){
                    if ($(node.selector).length) {
                        for (var j = 0; j < $(node.selector).length; j++){
                            var sell = $(node.selector+':nth-of-type('+j+')');
                            dataObj[node.id] = sell.html();
                            scrapeData.push(dataObj);
                        }
                    }
                } else {
                    console.log('no multiple');
                }
                console.log(dataObj);
                resolve();
            }
        }));
    };
    return {
        start : async(function(){
            /**
             * Start Url
             * Fetch html for start url
              */
            var html = await(loadPage(configuration.startUrl));
            await(analyzeNode(html, configuration.selectors[0], {}));
            console.log("Result is =========================");
            console.log(scrapeData);
        })
    }
}

try {
    var tempConf = {"_id":"nairaland","startUrl":"http://www.nairaland.com/","selectors":[{"parentSelectors":["_root"],"type":"SelectorLink","multiple":true,"id":"topics","selector":"td.featured a","delay":""},{"parentSelectors":["topics"],"type":"SelectorText","multiple":true,"id":"comments","selector":"blockquote","regex":"","delay":""}]}
    new Scraper(tempConf).start();
} catch (e) {
    console.log(e);
}

app.listen('8072');
console.log('Magic happens on port 8072');

exports = module.exports = app;