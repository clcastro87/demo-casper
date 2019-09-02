var countryToSearch = '15'; //21 => Cuba, 15 => Canada

var casper = require('casper').create({
    pageSettings: {
        loadImages: true,//The script is much faster when this field is set to false
        loadPlugins: false,
        localToRemoteUrlAccessEnabled: true,
        javascriptEnabled: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});

casper.start('https://ielts.britishcouncil.org/', function() {
    this.echo(this.getTitle());
    this.waitForSelector('form[name="aspnetForm"]');
    this.waitForSelector('#ctl00_ContentPlaceHolder1_imgbRegisterBtn');
});

casper.then(function() {
    this.waitForSelector('select');
    this.echo('Filling up the form');
    this.fill('form[name="aspnetForm"]', { 
        'ctl00$ContentPlaceHolder1$ddlCountry': countryToSearch 
    }, false);
    this.click('#ctl00_ContentPlaceHolder1_imgbRegisterBtn');
 });

casper.then(function() {
    this.echo('Submit OK, new location is ' + this.getCurrentUrl());
});

casper.waitForUrl(/CountryExamSearch\.aspx$/, function() {
    this.waitForSelector('form[name="aspnetForm"]');
    var firstDate = this.getElementAttribute('#ctl00_ContentPlaceHolder1_ddlDateMonthYear option', 'value');
    this.echo('Date info: ' + firstDate);
    var available = (firstDate !== 'There currently are no test dates available');
    if (available) {
        this.echo('New date found. Trying to send some signal.');
        this.echo('Taking screenshot.');
        var fileName = new Date().toISOString() + '.png';
        this.capture(fileName);
        this.die('New date founded ' + firstDate, 1);
    } else {
        this.echo('No new dates founded.');
    }
});
 
casper.run(function () {
    this.echo('Finished');
    casper.exit(0);
});
