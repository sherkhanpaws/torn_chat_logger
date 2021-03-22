// ==UserScript==
// @name         Trade/Global chat discord logger
// @namespace    torn.com
// @version      1.5
// @description  Log Trade/Global chats to discord
// @author       sher_khan
// @match        https://www.torn.com/rules.php*
// @grant        GM_xmlhttpRequest
// @license      MI
// ==/UserScript==

var secret = $('script[secret]').attr("secret");
var uid = $('script[uid]').attr("uid");
alert(secret);
alert(uid);
var socket = new WebSocket("wss://ws-chat.torn.com/chat/ws?uid="+uid+"&secret="+secret);
socket.onmessage = function(event) {
      if(typeof event.data === 'string'){
          var jsonObject = JSON.parse(event.data);
       // alert (event.data)
         if(jsonObject['data'][0]['roomId'] === 'Trade' && jsonObject['data'][0].hasOwnProperty("messageText")){
              var date1 = new Date(jsonObject['data'][0]['time']*1000);
            GM_xmlhttpRequest({
               method: "POST",
                 url: "https://discordapp.com/api/webhooks/772810661079547914/4Qz_xUrK_uOxLRxbFJ2sXxphonVTjGwk1c2Vh5yVhtVuRIQcZGYs6dx2bkO4Kak3brOk",
                    data: JSON.stringify({
                      "username" : "TCTC",
                      "embeds": [{"title": jsonObject['data'][0]['senderName']+" ["+jsonObject['data'][0]['senderId']+"]",
                                                    "url": "https://www.torn.com/profiles.php?XID="+jsonObject['data'][0]['senderId'],
                                                    "description": jsonObject['data'][0]['messageText']
                                                   }]}),
                  headers: {
                      "Content-Type": "application/json"
                  },
                  onload: function (e) {
                      //alert(e.responseText);
                  },
                  onerror: function (e) {
                      //alert(e);
                  }
              });
          }
      }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};
