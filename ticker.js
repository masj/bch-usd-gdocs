
// A macro for google docs that will help you get BCH exchange rates into your excel sheets
// How to Use:
// 1. Create a new google spreadsheet
// 2. Go to Tools -> Script Editor
// 3. Delete everything in the edit window and replace with the code of this file
// 4. Click on the Save button (floppy disk icon)
// 5. Go back to your document and fetch the rate using: =fetchTicker("coinmarketcap")


function getBalance(btcAddress) {
    var response = UrlFetchApp.fetch('http://blockchain.info/address/' + btcAddress + '?format=json');
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data.final_balance * Math.pow(10,-8);
}

function donothammer()
{
    var cache = CacheService.getPublicCache()
    var now = (new Date()).getTime()
    var last = cache.get('last')

    if (null != last) {
        var lastTime = parseInt(last)
        var elapsed = now - lastTime
        var waitFor = 1 - elapsed
        if (0<waitFor)
            Utilities.sleep(waitFor)
    }
    
    cache.put('last', String(now))
}

function fetchCached(url)
{
    var publicCache = CacheService.getPublicCache()
    var cached = publicCache.get(url)

    if (null == cached) {
    
        donothammer()
        
        var response = UrlFetchApp.fetch(url)
        if ('undefined' != typeof(response)) {
            var code = response.getResponseCode()
            if (code<300) {
                var oneMin = 1 * 60
                cached = response.getContentText()
                publicCache.put(url, cached, oneMin)
            }
        }
    }

    return cached
}

function fetchTicker(
    tickerName     // e.g. :  'coinmarketcap'
)
{
    var url = "https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/"

    var r = fetchCached(url)
    if ('undefined' == typeof(r))
        return 'No data for ticker ' + tickerName
        
    r = Utilities.jsonParse(r)
    if ('undefined' == typeof(r))
        return 'Malformed JSON data returned by ticker ' + tickerName
    
    if (tickerName == 'coinmarketcap')
        r = r[0]['price_usd']

    if ('undefined' == typeof(r))
        return 'Unknown field ' + fieldName + ' for ticker ' + tickerName

    return r
}


