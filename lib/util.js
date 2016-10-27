'use strict';


exports.htmlTrim = htmlTrim;


exports.htmlEqual = function(html) {
  return function(res) {
    htmlTrim(res.text).should.equal(htmlTrim(html));
  };
};


function htmlTrim(html) {
  return html.trim().replace(/>\s+/g, '>').replace(/\s+</g, '<');
}
