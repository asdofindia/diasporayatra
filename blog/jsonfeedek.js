/*
* FeedEk jQuery RSS/ATOM Feed Plugin v2.0
* http://jquery-plugins.net/FeedEk/FeedEk.html https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com
*/
(function ($) {
  $.fn.FeedEk = function (opt) {
    var def = $.extend({
      FeedUrl: "http://rss.cnn.com/rss/edition.rss",
      MaxCount: 5,
      ShowDesc: true,
      ShowPubDate: true,
      CharacterLimit: 0,
      TitleLinkTarget: "_blank",
      DateFormat: "",
      DateFormatLang:"en"
    }, opt);
    var id = $(this).attr("id"), i, s = "",dt;
    $("#" + id).empty().append('<img src="loader.gif" />');
    $.ajax({
      url: def.FeedUrl,
      dataType: "json",
      success: function (data) {
        $("#" + id).empty();
        $.each(data, function (i, item) {
          s += '<li><div class="itemTitle"><a href="https://pod.ponk.pink/p/' + item.id + '" target="' + def.TitleLinkTarget + '" >' + item.title + "</a></div>";
          if (def.ShowPubDate){
            dt= new Date(item.created_at);
            if ($.trim(def.DateFormat).length > 0) {
              try {
                moment.lang(def.DateFormatLang);
                s += '<div class="itemDate">' + moment(dt).format(def.DateFormat) + "</div>";
              }
              catch (e){s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>";}
            }
            else {
              s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>";
            }
          }
          function mdlink(match,p1,p2,offset,string){
            if (p2.indexOf("/")===0){
              p2='https://pod.ponk.pink'+p2;
            }
            var returnvalue = '<a href='+p2+'" target="_blank">'+p1+'</a>';
            return returnvalue;
          }
          function profiles(match, p1, offset, string){
            var split=p1.split(" ; ");
            var name = split[0];
            var urlsplit=split[1].split("@");
            var did=urlsplit[0];
            var dpod=urlsplit[1];
            var returnvalue='<a href="https://'+dpod+'/u/'+did+'" target="_blank">'+name+'</a>';
            return returnvalue;
          }
          replacePattern1 = /\[(.*?)\]\((.*?)\)/ig;
          replacedcontent = item.text.replace(replacePattern1, mdlink);
          replacePattern2 = /@{(.*?)}/ig;
          replacedcontent = replacedcontent.replace(replacePattern2, profiles);
          if (def.ShowDesc) {
            if (def.DescCharacterLimit > 0 && item.textlength > def.DescCharacterLimit) {
              s += '<div class="itemContent">' + replacedcontent(0, def.DescCharacterLimit) + "...</div>";
            }
            else {
              s += '<div class="itemContent">' + replacedcontent + "</div>";
            }
          }
        });
        $("#" + id).append('<ul class="feedEkList">' + s + "</ul>");
      }
    });
  };
})(jQuery);
