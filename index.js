var debug = require("local-debug")('index');
var cache = require("level-json-cache")('podcast');
var scrape = require("scrape-url");

var EXPIRE = 86400000;

module.exports = modernSabahlar;

function modernSabahlar (callback) {
  cache.get('modern-sabahlar', function (error, podcast) {
    if (podcast) return callback(undefined, podcast);

    pull(function (error, result) {
      if (error) return callback(error);

      callback(undefined, result);

      cache.set('modern-sabahlar', result, '12 hours', function (error) {
        if (error) return debug('Failed to cache results');

        debug('Cached results for 12 hours');
      });
    });
  });
}

function pull (callback) {
  debug('Pulling results from radyoodtu.com.tr');

  scrape('http://www.radyoodtu.com.tr/podcast.php', '.podcast_title a', function (error, links) {
    if (error) return callback(error);

    callback(undefined, links.map(function (el) {
      var title = el.innerHTML;
      var date = title.split(' ').slice(-1)[0].split('/');
      date = new Date(date[1] + '-' + date[0] + '-' + date[2]);
      return { ts: +(date), source: el.href };
    }));
  });
}
