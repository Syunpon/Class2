var class_displayname;
var class_status;
var class_url;
var class_data;
var class_id_cookie;
var class_id;

var count;

function GetClassData() {
  class_url = GetCookie("class_url") + "=csv";
  console.log("url="+class_url);
  class_id_cookie = GetCookie("class_id");
  console.log("id="+class_id_cookie);
  class_displayname = GetCookie("class_displayname");
  console.log("displayname="+class_displayname);
  class_data = unescape(GetCookie("class_data"));
  console.log("data="+class_data);

  //class_id_cookie = "0";

  if (class_url == "" || class_displayname == "" || class_data == "") {
    if (class_id_cookie != "") {
      class_id = Number(class_id_cookie);

      var xmlhttp_ = new XMLHttpRequest();

      xmlhttp_.onreadystatechange = function() {
        if (xmlhttp_.readyState == 4) {
          if (xmlhttp_.status == 200) {
            text = xmlhttp_.responseText.split("\n");
            for (var i = 0; i < text.length; i++) {
              var text2 = text[i].split(",");
              if (Number(text2[0]) == class_id) {
                class_displayname = text2[2];
                class_status = Number(text2[3]);
                class_url = text2[4];

                SetCookie("class_displayname", class_displayname);
                SetCookie("class_url", class_url);

                console.log("url="+class_url);
                console.log("id="+class_id_cookie);
                console.log("displayname="+class_displayname);
                console.log("data="+class_data);


              }
            }
            console.log(class_url);
            if (class_url != "=csv") {
              getclass_data(class_url);
            }else {
              document.getElementById("main_content").innerHTML = "正しいクラスコードを指定してください。";
            }
          } else {
          }

        }


      }
      xmlhttp_.open("GET", "https://docs.google.com/spreadsheets/d/e/2PACX-1vRENc8J2soUNi617DtRGZpBJsY9KZwy_5I-kjkLwehxDqL8Q8Jb3sW9T5RdiMSpWniPI_0aUKrQBAT1/pub?output=csv");
      xmlhttp_.send();

    }else {
      document.getElementById("main_content").innerHTML = "クラスコードが指定されていません。設定からクラスコードを指定してください。";
    }
  }else {
    init();
  }

}

function getclass_data(url_) {
  //console.log(url_);

  //if (class_status == 0) {
  var xmlhttp_ = new XMLHttpRequest();
  xmlhttp_.onreadystatechange = function() {
    if (xmlhttp_.readyState == 4) {
      if (xmlhttp_.status == 200) {
        class_data = xmlhttp_.responseText;
        //console.log(xmlhttp_.responseText);
        SetCookie("class_data", escape(xmlhttp_.responseText));
        //document.cookie = "class_data=" + escape(xmlhttp_.responseText);
        //console.log(ReplaceNL(ReplaceEqual(xmlhttp_.responseText)));
        //console.log(GetCookie("class_data"));

        init();
      } else {
        console.log("failed");
        document.getElementById("main_content").innerHTML = "取得できませんでした。";
      }
    }
  }
  xmlhttp_.open("GET", url_);
  xmlhttp_.send();
  //}
}

function init() {
  document.getElementById("class_displayname").innerHTML = class_displayname;

  //console.table(class_data);

  for (var i = 0; i < class_data.split("\n").length; i++) {
    var text2 = class_data.split("\n")[i].split(",");

    var name = text2[0];
    var get_type = Number(text2[1]);
    //var url = text2[2];

    if (get_type != 3) {
      document.getElementById("main_content").innerHTML += "<div id=\"" + name + "_parent\"></div>";
      document.getElementById(name + "_parent").innerHTML += "<ons-card><div class=\"content\"><ons-list-header>" + name + "</ons-list-header><div id=\"" + name + "\"></div></div></ons-card>";
      document.getElementById(name).innerHTML += "<ul class=\"list\"><li class=\"list-item\"><div class=\"list-item__right\"><ons-progress-circular indeterminate></ons-progress-circular></div></li></ul>";
      console.log("init : " + name);

      getData(name, url, get_type);
    }else {
      GetBirthday(url);
    }
  }
}

var xmlhttp = new Array();
var output = new Array();
var name = new Array();
var text = new Array();

function getData(name, url, get_type) {
  xmlhttp.push(XMLHttpRequest());
  output.push("");
  name.push("");
  text.push("");

  xmlhttp[count].onreadystatechange = function() {
    if (xmlhttp[count].readyState == 4) {
      //console.log(name);
      document.getElementById(name).innerHTML = "";

      if (xmlhttp[count].status == 200) {
        text[count] = RemoveCR(xmlhttp[count].responseText).split("\n");
        //console.log(text);

        output[count] = "<ul class=\"list\">";

        for (var i = 0; i < text[count].length; i++) {
          var text2 = text[count][i].split(",");

          switch (get_type) {
            case 0: //小テスト範囲
            output[count] += "<li class=\"list-item\"><div class=\"list-item__center\">" + text2[0] + "</div><div class=\"list-item__right\"><div class=\"list-item__label\">" + text2[1] + "</div></div></li>";
            break;

            case 1: //英語
            var label1;
            var label2;

            if (i > 0) {
              output[count] += "<ons-list-item expandable>" + text2[0] + "<div class=\"expandable-content\">" + label1 + " : " + text2[1] + "<br>" + label2 + " : " + text2[2] + "</div></ons-list-item>";
            }else {
              label1 = text2[1];
              label2 = text2[2];
            }
            break;

            case 2: //イベント
            output[count] += "<ons-list-item";
            if (text2[1] != "") output[count] += " expandable";
            output[count] += ">" +text2[0];
            if (text2[1] != "") output[count] += "<div class=\"expandable-content\">" + text2[1] + "</div>";
            output[count] += "</ons-list-item>";
            break;
          }
        }

        output[count] += "</ul>";

        //console.log(output);
        document.getElementById(name).innerHTML = output[count];
        console.log("end : " + name[count]);
      } else {
        document.getElementById(name + "_parent").innerHTML = "取得できませんでした。";
      }
    }
  }

  xmlhttp[count].open("GET", url);
  xmlhttp[count].send();
  count++;
}

function RemoveCR(str) {
  if (str !== undefined){
    var result = str.replace('\r', "");
    //「str」と「result」が同じ文字列になるまで繰り返す
    while(result !== str) {
      str = str.replace('\r', '');
      result = result.replace('\r', "");
    }
    return result;
  }
}

function RemoveSpace(str) {
  if (str !== undefined){
    var result = str.replace(' ', "");
    //「str」と「result」が同じ文字列になるまで繰り返す
    while(result !== str) {
      str = str.replace(' ', '');
      result = result.replace(' ', "");
    }
    return result;
  }
}

function SetCookie(name, value) {
  var nowDate2 = new Date();
  var date_end;
  if (nowDate2.getMonth() <= 2) {
    date_end = new Date(nowDate2.getFullYear(), 2, 31, 0, 0);
  }else {
    date_end = new Date(nowDate2.getFullYear() + 1, 2, 31, 0, 0);
  }
  document.cookie = "" + name + "=" + value + "; expires=" + date_end.toGMTString();

  console.log("Cookie［" + name + "］ was saved as " + GetCookie(name));
}

function DeleteCookie(name) {
  document.cookie = "" + name + "=; max-age=0";
  console.log("Cookie［" + name + "］ was deleted.");
}

function CheckBirthday() {
  var nowDate = new Date();
  var month_now = nowDate.getMonth() + 1;
  var day_now = nowDate.getDate();

  var tomorrowDate = new Date();
  tomorrowDate.setDate( tomorrowDate.getDate() + 1);
  var month_tomorrow = tomorrowDate.getMonth() + 1;
  var day_tomorrow = tomorrowDate.getDate();

  var match_count = 0;
  var match_count2 = 0;

  for (var i = 0; i < birth_text.length; i++) {
    var birth_text_1 = birth_text[i].split(",");
    var month = parseInt(birth_text_1[0]);
    var day = parseInt(birth_text_1[1]);
    if (month == month_now && day == day_now) match_count++;
  }

  for (var i = 0; i < birth_text.length; i++) {
    var birth_text_1 = birth_text[i].split(",");
    var month = parseInt(birth_text_1[0]);
    var day = parseInt(birth_text_1[1]);
    if (month == month_tomorrow && day == day_tomorrow) match_count2++;
  }

  if (match_count > 0) {
    var output_birthday = "";
    output_birthday = "<ons-card><div class=\"title\" id=\"Birthday\"></div>";
    if (match_count2 > 0) output_birthday += "<div class=\"content\" id=\"Birthday2\"></div>";
    output_birthday += "</ons-card>";

    document.getElementById("Birthday_parent").innerHTML = output_birthday;

    document.getElementById("Birthday").innerHTML = "今日誕生日を迎える人が" + match_count + "人います🎉";
    if (match_count2 > 0) document.getElementById("Birthday2").innerHTML = "明日誕生日を迎える人が" + match_count2 + "人います🎉";
  }else {
    if (match_count2 > 0) {
      document.getElementById("Birthday_parent").innerHTML = "<ons-card><div class=\"content\" id=\"Birthday2\"></div></ons-card>";
      document.getElementById("Birthday2").innerHTML = "明日誕生日を迎える人が" + match_count2 + "人います";
    }else {
      document.getElementById("Birthday_parent").innerHTML = "";
    }
  }
  setTimeout("CheckBirthday()", 1000);
}

var xmlhttp5 = new XMLHttpRequest();
var birth_text = "";

function GetBirthday(url_2) {
  xmlhttp5.onreadystatechange = function() {
    if (xmlhttp5.readyState == 4) {
      if (xmlhttp5.status == 200) {
        birth_text = xmlhttp5.responseText.split("\n");
        CheckBirthday();
      }
    }
  }

  xmlhttp5.open("GET", url_2);
  xmlhttp5.send();
}

GetClassData();
