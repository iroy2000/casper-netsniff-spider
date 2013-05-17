// URL variables
var visitedUrls = [], pendingUrls = [];

// Create instances
var casper = require('casper').create({ /*verbose: true, logLevel: 'debug'*/ });
var utils = require('utils');
var helpers = require('./helpers');
var fs = require('fs');
var page = casper;
var har; 
var startUrl = casper.cli.args[0];                                                                                                      

casper.resources = [];

if(casper.cli.args.length < 1) {
    casper.echo("Usage: casperjs spider.js <you_start_url>");   
}

// Spider from the given URL
function spider(url) {

    // Add the URL to the visited stack
    visitedUrls.push(url);

    // Open the URL
    casper.open(url).then(function() {
        page.endTime = new Date();
        page.title = casper.evaluate(function() {
            return document.title.replace(/\s+/g, "");
        });
        
        // generate har file
        har = helpers.createHAR(casper.getCurrentUrl(), page.title, casper.startTime, page.resources); 
        fs.write('har/' + page.title +'.har',JSON.stringify(har, undefined, 4), 'w');
        page.resources = []; 
        casper.capture('png/' + page.title +'.png');

        // Set the status style based on server status code
        var status = this.status().currentHTTPStatus;
        switch(status) {
            case 200: var statusStyle = { fg: 'green', bold: true }; break;
            case 404: var statusStyle = { fg: 'red', bold: true }; break;
             default: var statusStyle = { fg: 'magenta', bold: true }; break;
        }

        // Display the spidered URL and status
        this.echo(this.colorizer.format(status, statusStyle) + ' ' + url);

        // Find links present on this page
        var links = this.evaluate(function() {
            var links = [];
            Array.prototype.forEach.call(__utils__.findAll('a'), function(e) {
                links.push(e.getAttribute('href'));
            });
            return links;
        });

        // Add newly found URLs to the stack
        var baseUrl = this.getGlobal('location').origin;
        Array.prototype.forEach.call(links, function(link) {
            var newUrl = helpers.absoluteUri(baseUrl, link);
            if (pendingUrls.indexOf(newUrl) == -1 && visitedUrls.indexOf(newUrl) == -1) {
                //casper.echo(casper.colorizer.format('-> Pushed ' + newUrl + ' onto the stack', { fg: 'magenta' }));
                pendingUrls.push(newUrl);
            }
        });

        // If there are URLs to be processed
        if (pendingUrls.length > 0) {
            var nextUrl = pendingUrls.shift();
            //this.echo(this.colorizer.format('<- Popped ' + nextUrl + ' from the stack', { fg: 'blue' }));
            spider(nextUrl);
        }

    });

}

// when page start
casper.on('load.started', function() {
    this.startTime = new Date();
});

// when resource start 
casper.on('resource.requested', function(req) {
    this.resources[req.id] = {
        request: req,
        startReply: null,
        endReply: null
    };
});

// when resource received
casper.on('resource.received', function(res) {
    if (res.stage === 'start') {
        this.resources[res.id].startReply = res;
    }
    if (res.stage === 'end') {
        this.resources[res.id].endReply = res;
    }    
});


// Start spidering
casper.start(startUrl, function() {
    spider(startUrl);
});

// Start the run
casper.run();
