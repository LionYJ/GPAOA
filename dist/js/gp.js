var INS_SELECT = "A4";
var INS_MANAGE_CHANNEL = "70";
var INS_INSTALL = "E6";
var INS_LOAD = "E8"; 	
var INS_DELETE = "E4";
var INS_PUT_KEY = "D8";
var INS_GET_DATA = "CA";
var INS_STORE_DATA = "E2";
var INS_GET_STATUS = "F2";
var INS_SET_STATUS = "F0";
var INS_INITIALIZE_UPDATE = "50";
var INS_EXTERNAL_AUTHENTICATE = "82";
var INS_BEGIN_R_MAC_SESSION = "7A";
var INS_END_R_MAC_SESSION = "78";
var INS_CRS_GET_STATUS = "F2";
var INS_CRS_SET_STATUS = "F0";
var INS_CRS_SELECT = "A4";
var INS_CRS_GET_DATA = "CA";
var TAB = "&nbsp;&nbsp;&nbsp;&nbsp;";
var TAB2 = TAB + TAB;
var TAB3 = TAB2 + TAB;


function getCla(apduData) {
   var offset = 0;
   var cla = apduData.substr(offset, 2);
   return cla;
}

function getIns(apduData) {
   var cla = apduData.substr(2, 2);
   return cla;
}

function getP1(apduData) {
   var cla = apduData.substr(4, 2);
   return cla;
}

function getP2(apduData) {
   var cla = apduData.substr(6, 2);
   return cla;
}

function getLc(apduData) {
   var cla = apduData.substr(8, 2);
   return cla;
}

function getDataField(apduData, lcLength) {
    var data_field = apduData.substr(10, lcLength);
    return data_field;
}

function organizeDisplayDiv(cla, ins, p1, p2, lcHex, data_field) {
   $("#cla").html(cla);
   $("#ins").html(ins);
   $("#p1").html(p1);
   $("#p2").html(p2);
   $("#lc").html(lcHex);
   //$("#le").html("00");
   $("#data_field").html(data_field);
}

function numToHexString(num) {
   var numStrHex = num.toString(16).toUpperCase();
   if (num < 16) {
     numStrHex = "0" + numStrHex;
   }
   return numStrHex;
}

function checkAID(aidValue) {
  var aidLength = aidValue.length / 2;
  
  if (aidValue.length%2 != 0) {
    return false;
  }

  if (aidLength < 5 || aidLength > 16) {
    return false;
  }

  return true;
}

function analyzeSelect(apduData) {
   //alert(apduData);
   //var analyseApduData = apduData;
   var cla = getCla(apduData);

   var ins = getIns(apduData);
   ins += " [SELECT]";

   var p1 = getP1(apduData);
   if (p1 == "04") {
   	 p1 += " [" + "Select by name" + "]";
   }

   var p2 = getP2(apduData);
   if (p2 == "00") {
   	 p2 += " [" + "First or only occurrence" + "]";
   } else if (p1 == "02") {
   	 p2 += " [" + "Next occurrence" + "]";
   }

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);

   var aid = getDataField(apduData, lc * 2);
   aid += " [" + "Application AID" + "]";

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, aid);
}

function analyzeManageChannel(apduData) {
   //alert(apduData);
   //var analyseApduData = apduData;
   var cla = getCla(apduData);

   var ins = getIns(apduData);
   ins += " [MANAGE CHANNEL]";

   var p1 = getP1(apduData);
   var original_p1 = p1;
   if (p1 == "00") {
      p1 += " [" + "Open the Supplementary Logical Channel" + "]";
   } else if (p1 == "80") {
      p1 += " [" + "Close the Supplementary Logical Channel" + "]";
   }

   var p2 = getP2(apduData);
   if (original_p1 == "00" && p2 == "00") {
      p2 += " [" + " Open next available Supplementary Logical Channel" + "]";
   } else {
      p2 += " [" + " Supplementary Logical Channel Number" + "]";
   }

   /*
   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var le = "00";
   if (lc != 0) {
      le = lcHex;
   }
   */

   organizeDisplayDiv(cla, ins, p1, p2, "Not present", "Not present");
}

// 80E602013401100210110310111229EF14C6021314C7021516C8021718CD021920DD022122B61142022324450225265F200227289302293000
function analyzeInsall(apduData) {
   //alert(apduData);
   // $("#ins").html(INS_INSTALL);
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [INSTALL]";

   var p1 = getP1(apduData);
   var p1Num = parseInt("0x" + p1);
   p1 += " [";
   if ((p1Num & 0x80) == 0x80) {
      p1 += "More INSTALL commands, ";
   } else {
      p1 += "Last (or only) command, ";
   }
   if ((p1Num & 0x02) == 0x02) {
      p1 += "For load ";
   }
   if ((p1Num & 0x04) == 0x04) {
      p1 += "For install ";
   }
   if ((p1Num & 0x08) == 0x08) {
      p1 += "For make selectable ";
   }
   if ((p1Num & 0x10) == 0x10) {
      p1 += "For extradition ";
   }
   if ((p1Num & 0x20) == 0x20) {
      p1 += "For personalization ";
   }
   if ((p1Num & 0x40) == 0x40) {
      p1 += "For registry update ";
   }
   p1 += "]";

   var p2 = getP2(apduData);
   if (p2 == "00") {
      p2 += " [" + "No information" + "]";
   } else if (p2 == "01") {
      p2 += " [" + "Beginning of the combined Load, Install and Make Selectable process" + "]";
   } else if (p2 == "03") { 
      p2 += " [" + "End of the combined Load, Install and Make Selectable process" + "]";
   }
   
   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      lc -= 8;
      mac = apduData.substr(apduData.length - 16) + " [MAC]";
   }

   var lcData = getDataField(apduData, lc * 2);
   var installType = numToHexString(p1Num & 0x7F);
   var showAnalyseData = analyzeInstallByType(lcData, lc, installType, p2);

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, showAnalyseData + mac);
}

function analyzeInstallByType(lcData, lc, installType, p2) {
   var data_filed_lv1 = "";
   var data_filed_lv2 = "";
   var data_filed_lv2 = "";
   var data_field_parameter_name = "";
   var data_field_privilege = " [Privileges LV] ";
   var data_filed_token_name = "";
   switch (installType) {
      case "02": // For_load
         data_filed_lv1 = " [Load File AID LV] <br>";
         data_filed_lv2 = " [Security Domain AID LV] <br>";
         data_filed_lv3 = " [Load File Data Block Hash LV] <br>";
         data_field_parameter_name = " [Load Parameters LV] <br>";
         data_filed_token_name = " [Load Token LV] <br>";
      break;
      case "04": // For_install
      case "0C": // For_install & make selectable
         data_filed_lv1 = " [Executable Load File AID LV] <br>";
         data_filed_lv2 = " [Executable Module AID] <br>";
         data_filed_lv3 = " [Application AID LV] <br>";
         data_field_parameter_name = " [Install Parameters LV] <br>";
         data_filed_token_name = " [Install Token LV] <br>";
      break;
      case "08": // For make selectable
         data_filed_lv1 = " [Length of data] <br>";
         data_filed_lv2 = " [Length of data] <br>";
         data_filed_lv3 = " [Application AID LV] <br>";
         data_field_parameter_name = " [Make Selectable Parameters LV] <br>";
         data_filed_token_name = " [Make Selectable Token LV] <br>";
      break;
      case "0E": // Combined Install[For load,install and make selectable]
         if (p2 == "01") { // for_load
            data_filed_lv1 = " [Load File AID LV] <br>";
            data_filed_lv2 = " [Security Domain AID LV] <br>";
            data_filed_lv3 = " [Load File Data Block Hash LV] <br>";
            data_field_parameter_name = " [Load Parameters LV] <br>";
            data_filed_token_name = " [Load Token LV] <br>";
         } else if (p2 == "03") { // for_install
            data_filed_lv1 = " [Executable Load File AID LV] <br>";
            data_filed_lv2 = " [Executable Module AID] <br>";
            data_filed_lv3 = " [Application AID LV] <br>";
            data_field_parameter_name = " [Install Parameters LV] <br>";
            data_filed_token_name = " [Install Token LV] <br>";
         }
      break;
      case "10": // For extradition
         data_filed_lv1 = " [Security Domain AID] <br>";
         data_filed_lv2 = " [Length of data] <br>";
         data_filed_lv3 = " [Application or Executable Load File AID LV] <br>";
         data_field_parameter_name = " [Extradition Selectable Parameters LV] <br>";
         data_filed_token_name = " [Extradition Token LV] <br>";
      break;
      case "20": // For personalization
         data_filed_lv1 = " [Length of data] <br>";
         data_filed_lv2 = " [Length of data] <br>";
         data_filed_lv3 = " [Application AID LV] <br>";
      break;
      case "40": // For registry update
         data_filed_lv1 = " [Security Domain AID] <br>";
         data_filed_lv2 = " [Length of data] <br>";
         data_filed_lv3 = " [Application AID LV] <br>";
         data_field_parameter_name = " [Registry Update Parameters LV] <br>";
         data_filed_token_name = " [Registry Update Token LV] <br>";
      break;

      default:
      break;
   }

   var showAnalyseData = "";
   var offset = 0;
   var tag = "";
   var data = "";
   var lengthHex = "";
   var length = 0;

   // Data Field LV1
   lengthHex = lcData.substr(offset, 2);
   length = parseInt("0x" + lengthHex);
   data = lcData.substr(offset + 2, 2 * length);
   showAnalyseData += lengthHex + " " + data + data_filed_lv1;
   offset += 2 + 2 * length;

   // Data Field LV2
   lengthHex = lcData.substr(offset, 2);
   length = parseInt("0x" + lengthHex);
   data = lcData.substr(offset + 2, 2 * length);
   showAnalyseData += lengthHex + " " + data + data_filed_lv2;
   offset += 2 + 2 * length;

   // Data Field LV3
   lengthHex = lcData.substr(offset, 2);
   length = parseInt("0x" + lengthHex);
   data = lcData.substr(offset + 2, 2 * length);
   showAnalyseData += lengthHex + " " + data + data_filed_lv3;
   offset += 2 + 2 * length;

   // Install[for install, for install & make selectable, for registry update]
   // Privileges LV
   if ((installType == "04") || (installType == "08") || (installType == "0C") || (installType == "40") || ((installType == "0E") && (p2 == "03"))) {
      lengthHex = lcData.substr(offset, 2);
      length = parseInt("0x" + lengthHex);
      data = lcData.substr(offset + 2, 2 * length);
      showAnalyseData += lengthHex + data_field_privilege + analyzePrivileges(data, length) + "<br>";
      offset += 2 + 2 * length;
   }

   // Except Install[for personalization]
   if (installType != "20") {
      // Install Parameters field LV
      lengthHex = lcData.substr(offset, 2);
      length = parseInt("0x" + lengthHex);
      data = lcData.substr(offset + 2, 2 * length);

      showAnalyseData += lengthHex + data_field_parameter_name + analyzeParameters(data, length);
      offset += 2 + 2 * length;

      // Token
      lengthHex = lcData.substr(offset, 2);
      length = parseInt("0x" + lengthHex);
      data = lcData.substr(offset + 2, 2 * length);
      showAnalyseData += lengthHex + " " + data + data_filed_token_name;
   } else {
      // Three 'Length of data'
      showAnalyseData += lcData.substr(offset, 6) + " [Three 'Length of data']" +  "<br>";
   }
   
   return showAnalyseData;
}

function analyzeParameters(parameterData, parameterLen) {
   var offset = 0;
   var tag = "";
   var length = 0
   var lengthHex = "";
   var data = "";
   var showAnalyseData = "";

   while (offset < parameterLen * 2) {
      tag = parameterData.substr(offset, 2);
      switch (tag) {
         case "C9":
            lengthHex = parameterData.substr(offset + 2, 2);
            length = parseInt("0x" + lengthHex);
            showAnalyseData += TAB + analyzeC9Parameters(parameterData, offset, length * 2);
            offset += 4 + length * 2;
         break;
         case "EF":
            lengthHex = parameterData.substr(offset + 2, 2);
            length = parseInt("0x" + lengthHex);
            showAnalyseData += TAB + analyzeEFParameters(parameterData, offset, length * 2);
            offset += 4 + length * 2;
         break;;
         case "B6":
            lengthHex = parameterData.substr(offset + 2, 2);
            length = parseInt("0x" + lengthHex);
            showAnalyseData += TAB + analyzeB6Parameters(parameterData, offset, length * 2);
            offset += 4 + length * 2;
         break;
         case "EA":
            lengthHex = parameterData.substr(offset + 2, 2);
            length = parseInt("0x" + lengthHex);
            showAnalyseData += TAB + analyzeEAParameters(parameterData, offset, length * 2);
            offset += 4 + length * 2;
         break;

         default:
            lengthHex = parameterData.substr(offset + 2, 2);
            length = parseInt("0x" + lengthHex);
            showAnalyseData += TAB + tag + " " + lengthHex + " " + parameterData.substr(offset + 4, length * 2);
            offset += 4 + length * 2;
         break;
      };
   }

   return showAnalyseData;
}

function analyzeC9Parameters(lcData, offset, length) {
   var displayData = "C9 " + lcData.substr(offset + 2, 2) + " [Application Specific Parameters] <br>";
   /*
   offset += 4;
   var tag;
   var lenHex;
   var len;
   var length = 0;
   length += offset;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "4F":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "4F " + lenHex + " " + lcData.substr(offset + 4, len) + " [Security Domain AID] <br>";
         offset += 4 + len;
      break;
      case "C3":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "C3 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Load File Data Block Signature] <br>";
         offset += 4 + len;
      break;
      default:
      break;
      }
   }
   */
   data = lcData.substr(offset + 4, length);
   displayData += TAB2 + data + (data != "" ? "<br>" : "");
   return displayData;
}

function analyzeEFParameters(lcData, offset, length) {
   var displayData = "EF " + lcData.substr(offset + 2, 2) + " [System Specific Parameters] <br>";
   offset += 4;
   var tag;
   var lenHex;
   var len;
   length += offset;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "C6":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "C6 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Non volatile code Minimum Memory requirement] <br>";
         offset += 4 + len;
      break;
      case "C7":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "C7 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Volatile data Minimum Memory requirement] <br>";
         offset += 4 + len;
      break;
      case "C8":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "C8 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Non volatile data Minimum Memory requirement] <br>";
         offset += 4 + len;
      break;
      case "CD":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "CD " + lenHex + " " + lcData.substr(offset + 4, len) + " [Load File Data Block format id] <br>";
         offset += 4 + len;
      break;
      case "DD":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "DD " + lenHex + " " + lcData.substr(offset + 4, len) + " [Load File Data Block Parameters] <br>";
         offset += 4 + len;
      break;
      case "CB":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "CB " + lenHex + " " + lcData.substr(offset + 4, len) + " [Global Service Parameters] <br>";
         offset += 4 + len;
      break;
      case "D7":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "D7 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Volatile Reserved Memory] <br>";
         offset += 4 + len;
      break;
      case "D8":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "D8 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Non volatile Reserved Memory] <br>";
         offset += 4 + len;
      break;
      case "CA":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "CA " + lenHex + " " + lcData.substr(offset + 4, len) + " [TS 102 226 specific parameter] <br>";
         offset += 4 + len;
      break;
      case "CF":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "CF " + lenHex + " " + lcData.substr(offset + 4, len) + " [Implicit selection parameter] <br>";
         offset += 4 + len;
      break;
      case "D9":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "D9 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Restrict Parameter] <br>";
         offset += 4 + len;
      break;

      // Amend C
      case "A0":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + analyzeA0Parameters(lcData, offset, len);
         offset += 4 + len;
      break;
      case "A1":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + analyzeA1Parameters(lcData, offset, len);
         offset += 4 + len;
      break;
      case "B0":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + analyzeB0Parameters(lcData, offset, len);
         offset += 4 + len;
      break;
      case "82":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "82 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Cumulative Granted Volatile Memory] <br>";
         offset += 4 + len;
      break;
      case "83":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "83 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Cumulative Granted Non Volatile Memory] <br>";
         offset += 4 + len;
      break;
      
      default:
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + lcData.substr(offset, 2) + " " + lenHex + " " + lcData.substr(offset + 4, len) + "<br>";
         offset += 4 + len;
      break;
      }
   }
   
   return displayData;
}

function analyzeA0Parameters(lcData, offset, length) {
   var displayData = "A0 " + lcData.substr(offset + 2, 2) + " [Contactless Protocol Parameters] <br>";
   offset += 4;
   var tag;
   var lenHex;
   var len;
   length += offset;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "80":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "80 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Assigned Protocols for implicit selection] <br>";
         offset += 4 + len;
      break;
      case "81":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "81 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Initial Contactless Activation State] <br>";
         offset += 4 + len;
      break;
      case "A2":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A2 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Contactless Protocol Parameters Profile] <br>";
         offset += 4 + len;
      break;
      case "83":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "83 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Recognition Algorithm] <br>";
         offset += 4 + len;
      break;
      case "84":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "84 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Continuous Processing] <br>";
         offset += 4 + len;
      break;
      case "A5":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A5 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Communication Interface Access Parameters] <br>";
         offset += 4 + len;
      case "86":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "86 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Protocol Data Type A (Card Emulation Mode)] <br>";
         offset += 4 + len;
      break;
      case "87":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "87 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Protocol Data Type B (Card Emulation Mode)] <br>";
         offset += 4 + len;
      break;
      case "88":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "88 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Protocol Data Type F (Card Emulation Mode)] <br>";
         offset += 4 + len;
      break;
      default:
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + lcData.substr(offset, 2) + " " + lenHex + " " + lcData.substr(offset + 4, len) + "<br>";
         offset += 4 + len;
      break;
      }
   }
   
   return displayData;
}

function analyzeA1Parameters(lcData, offset, length) {
   var displayData = "A1 " + lcData.substr(offset + 2, 2) + " [User Interaction Parameters] <br>";
   offset += 4;
   var tag;
   var lenHex;
   var len;
   length += offset;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "7F":
         lenHex = lcData.substr(offset + 4, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "7F20 " + lenHex + " " + lcData.substr(offset + 6, len) + " [Display Control Template] <br>";
         offset += 6 + len;
      break;
      case "A0":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A0 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Head Application] <br>";
         offset += 4 + len;
      case "A1":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A1 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Add to the Group Authorization List] <br>";
         offset += 4 + len;
      case "A2":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A2 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Remove from the Group Authorization List] <br>";
         offset += 4 + len;
       case "A3":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A3 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Add to the CREL List] <br>";
         offset += 4 + len;
      case "A4":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A4 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Remove from the CREL List] <br>";
         offset += 4 + len;
      case "A5":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A5 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Policy Restricted Applications] <br>";
         offset += 4 + len;
      case "A6":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "A6 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Application discretionary data] <br>";
         offset += 4 + len;
      case "87":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "87 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Application Family] <br>";
         offset += 4 + len;
      case "88":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "88 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Display Required Indicator] <br>";
         offset += 4 + len;  
      break;
      default:
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + lcData.substr(offset, 2) + " " + lenHex + " " + lcData.substr(offset + 4, len) + "<br>";
         offset += 4 + len;
      break;
      }
   }
   
   return displayData;
}

function analyzeB0Parameters(lcData, offset, length) {
   var displayData = "B0 " + lcData.substr(offset + 2, 2) + " [Additional Contactless Parameters] <br>";
   var originOffset = offset;
   var originLength = length;
   offset += 4;
   var tag;
   var lenHex;
   var len;
   length += offset;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "86":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "86 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Reader mode protocol data Type A:DATARATE_MAX] <br>";
         offset += 4 + len;
      break;
      case "87":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB3 + "87 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Reader mode protocol data Type B:AFI + HIGHER_LAYER_DATA_LV] <br>";
         offset += 4 + len;
      break;
      default:
         displayData += TAB3 + lcData.substr(originOffset + 4, originLength) + "<br>";
         offset += 4 + originLength;
      break;
      }
   }
   
   return displayData;
}

function analyzeB6Parameters(lcData, offset, length) {
   var displayData = "B6 " + lcData.substr(offset + 2, 2) + " [Control Reference Template for Digital Signature (Token)] <br>";
   offset += 4;
   var tag;
   var lenHex;
   var len;
   length += offset;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "42":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "42 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Identification Number of the Security Domain with the Token Verification privilege] <br>";
         offset += 4 + len;
      break;
      case "45":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "45 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Image Number of the Security Domain with the Token Verification privilege] <br>";
         offset += 4 + len;
      break;
      case "5F":
         lenHex = lcData.substr(offset + 4, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "5F20 " + lenHex + " " + lcData.substr(offset + 6, len) + " [Application Provider identifier] <br>";
         offset += 6 + len;
      break;
      case "93":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + "93 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Token identifier/number(digital signature counter)] <br>";
         offset += 4 + len;
      break;
      default:
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB2 + lcData.substr(offset, 2) + " " + lenHex + " " + lcData.substr(offset + 4, len) + "<br>";
         offset += 4 + len;
      break;
      }
   }
   
   return displayData;
}

function analyzeEAParameters(parameterData, offset, length) {
   var displayData = "EA " + parameterData.substr(offset + 2, 2) + " [UICC System Specific Parameters] <br>";
   data = parameterData.substr(offset + 4, length);
   displayData += TAB2 + data + "<br>";
   return displayData;
}

function analyzePrivileges(privileges, length) {
   var displayData = "";
   var data = "";
   switch (length) {
      case 3:
         // privilege2
         var privilege2 = privileges.substr(2, 2);
         var privilege2Num = parseInt("0x" + privilege2);
         data = "["
         if ((privilege2Num & 0x80) == 0x80) {
            data += "Trusted Path,";
         }
         if ((privilege2Num & 0x40) == 0x40) {
            data += "Authorized Management,";
         }
         if ((privilege2Num & 0x20) == 0x20) {
            data += "Token Management,";
         }
         if ((privilege2Num & 0x10) == 0x10) {
            data += "Global Delete,";
         }
         if ((privilege2Num & 0x08) == 0x08) {
            data += "Global Lock,";
         }
         if ((privilege2Num & 0x04) == 0x04) {
            data += "Global Registry,";
         }
         if ((privilege2Num & 0x02) == 0x02) {
            data += "Final Application,";
         }
         if ((privilege2Num & 0x01) == 0x01) {
            data += "Global Service,";
         }
         data += "]";
         displayData += "<br>" + TAB + privilege2 + data;

         // privilege3
         var privilege3 = privileges.substr(4, 2);
         var privilege3Num = parseInt("0x" + privilege3);
         data = "["
         if ((privilege3Num & 0x80) == 0x80) {
            data += "Receipt Generation,";
         }
         if ((privilege3Num & 0x40) == 0x40) {
            data += "Ciphered Load File Data Block,";
         }
         if ((privilege3Num & 0x20) == 0x20) {
            data += "Contactless Activation,";
         }
         if ((privilege3Num & 0x10) == 0x10) {
            data += "Contactless Self-Activation,";
         }
         data += "]";
         displayData += "<br>" + TAB + privilege3 + data;
      case 1:
         // privilege1
         var privilege1 = privileges.substr(0, 2);
         var privilege1Num = parseInt("0x" + privilege1);
         data = "["
         if ((privilege1Num & 0x80) == 0x80) {
            data += "Security Domain,";
         }
         if ((privilege1Num & 0xC0) == 0xC0) {
            data += "DAP Verification,";
         }
         if ((privilege1Num & 0xA0) == 0xA0) {
            data += "Delegated Management,";
         }
         if ((privilege1Num & 0x10) == 0x10) {
            data += "Card Lock,";
         }
         if ((privilege1Num & 0x08) == 0x08) {
            data += "Card Terminate,";
         }
         if ((privilege1Num & 0x04) == 0x04) {
            data += "Card Reset,";
         }
         if ((privilege1Num & 0x02) == 0x02) {
            data += "CVM Management,";
         }
         if ((privilege1Num & 0xC1) == 0xC1) {
            data += "Mandated DAP Verification,";
         }
         data += "]";
         data = (data == "[]" ? "[No Privilege]" : data);
         displayData = "<br>" + TAB + privilege1 + data + displayData;
         break;

         default:
            displayData += "Privileges Error!";
            break;
   }
   return displayData;
}

// 84E80000D0C482018601001ADECAFFED010204000110D156000101800380000000010000010802001F001A001F0014000B0026000C0067000A00100000005D00000000000001010004000B01020107A00000006201010300140110D1560001018003800000000100000008000106000C0080030100010701000000350700670005318F00013D181D1E8C00042E1B181D0441181D258B00027A0540188C00031806900B3D0310BF383D0404383D0510C43887007A0522198B00052D1A0425321F10EC6B231A032510806A08116EF9631F22D7093AB4
function analyzeLoad(apduData) {
   //alert(apduData);
   //$("#ins").html(INS_LOAD);
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [LOAD]";

   var p1 = getP1(apduData);

   if (p1 == "80") {
      p1 += " [" + "Last command" + "]";
   } else if (p1 == "00") {
      p1 += " [" + "More LOAD commands" + "]";
   }

   var p2 = getP2(apduData);
   p2 += " [" + "Block Number" + "]";
   
   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      lc -= 8;
      mac = apduData.substr(apduData.length - 16) + " [MAC]";
   }
   var lcData = getDataField(apduData, lc * 2);
   var showAnalyseData = "";
   var offset = 0;
   var tag;
   while (offset < lc * 2) {
      tag = lcData.substr(offset, 2);
      switch (tag) {
         case  "E2":
            var dapLen = parseInt("0x" + lcData.substr(offset + 2, 2));
            showAnalyseData += analyzeDapBlock(lcData, offset, dapLen);
            offset += 4 + dapLen * 2;
         break;
         case "C4":
         case "D4":
            var blockType = (tag == "C4" ? " [Load File Data Block]" : " [Ciphered Load File Data Block]");
            var c4Len = 1;
            var fileDataBlockLen = parseInt("0x" + lcData.substr(offset + 2, 2));
            if (fileDataBlockLen == 0x82) {
               c4Len = 3;
               fileDataBlockLen = (parseInt("0x" + lcData.substr(offset + 4, 2)) | parseInt("0x" + lcData.substr(offset + 6, 2)));
            }
            var blockData = lcData.substr(offset + 2 + 2 * c4Len);
            showAnalyseData += lcData.substr(offset, 2) + " " + lcData.substr(offset + 2, 2 * c4Len) + " " 
                            + blockData + blockType + "<br>";
            offset += 2 + 2 * c4Len + blockData.length;
         break;

         default:
            showAnalyseData += lcData.substr(offset);
            offset = lc * 2;
         break;
      };
   }

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, showAnalyseData + mac);
}

// analyze E2(Dap block)
/*
   E2: DAP Block
      4F: Security Domain AID  
      C3: Load File Data Block Signature  
*/
function analyzeDapBlock(lcData, offset, dapBlockLen) {
   var displayData = "E2 " + lcData.substr(offset + 2, 2) + " [DAP Block] <br>";
   offset += 4;
   var tag;
   var lenHex;
   var len;
   var length = offset + dapBlockLen;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "4F":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "4F " + lenHex + " " + lcData.substr(offset + 4, len) + " [Security Domain AID] <br>";
         offset += 4 + len;
      break;
      case "C3":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "C3 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Load File Data Block Signature] <br>";
         offset += 4 + len;
      break;
      default:
      break;
      }
   }

   return displayData;
}

// analyze B6(Control Reference Template  for Digital Signature )
/*
B6
   42:   Identification Number of the Security Domain with the Token Verification privilege 
   45:   Image number of the Security Domain with the Token Verification privilege 
   5F20: Application  Provider identifier 
   93:   Token identifier/number (digital signature counter)  
*/
function analyzeCRTforDS(lcData, offset, crtLength) {
   var displayData = "B6 " + lcData.substr(offset + 2, 2) + " [Control Reference Template  for Digital Signature] <br>";
   offset += 4;
   var tag;
   var lenHex;
   var len;
   var length = offset + crtLength;
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      
      switch (tag) {
      case "42":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "42 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Identification Number of the SD with the Token Verification privilege] <br>";
         offset += 4 + len;
      break;
      case "45":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "45 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Image number of the SD with the Token Verification privilege] <br>";
         offset += 4 + len;
      break;
      case "5F":
         // 5F20
         lenHex = lcData.substr(offset + 4, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "5F20 " + lenHex + " " + lcData.substr(offset + 6, len) + " [Application  Provider identifier] <br>";
         offset += 6 + len;
      break;
      case "93":
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "93 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Token identifier/number (digital signature counter)] <br>";
         offset += 4 + len;
      break;
      default:
      break;
      }
   }

   return displayData;
}

// 84E40000B14F10D15600010180038000000001BB080808B61242074953445F49494E45074953445F43494E9E8180909C82EE0CCA0960B344ACE8F09C94526DE304363C49E670DC8C5A56FD783340641D7F48960E009F11E057C17D98281F199E9C14BA6AC3A1A7672569E36531C4F2A1EA203478BAC833FBDFDC71BB7D1704B20D40D98BF06CF4B02D8EF1F6A041363FD12115463F3934C8073DBF7FCE04EFE8971316ECF7792B31456870D50AF7B950FD8000072F1E
function analyzeDelete(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [DELETE]";

   var p1 = getP1(apduData);

   if (p1 == "00") {
      p1 += " [" + "Last (or only) command" + "]";
   } else if (p1 == "80") {
      p1 += " [" + "More DELETE commands" + "]";
   }

   var p2 = getP2(apduData);
   if (p2 == "00") {
      p2 += " [" + " Delete object" + "]";
   } else if (p2 == "80") {
      p2 += " [" + " Delete object and related object" + "]";
   } else if (p2 == "40") {
      p2 += " [" + " Delete a root Security Domain and all associated Applications" + "]";
   }

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      lc -= 8;
      mac = apduData.substr(apduData.length - 16) + " [MAC]";
   }
   var lcData = getDataField(apduData, lc * 2);
   var showAnalyseData = "";
   var offset = 0;
   var tag;
   while (offset < lc * 2) {
      tag = lcData.substr(offset, 2);
      switch (tag) {
         case  "4F":
            var aidLen = parseInt("0x" + lcData.substr(offset + 2, 2));
            showAnalyseData += lcData.substr(offset, 2) + " " + lcData.substr(offset + 2, 2) + " " 
                            + lcData.substr(offset + 4, aidLen * 2) + " [Executable Load File or Application AID]" + "<br>";
            offset += 4 + aidLen * 2;
         break;
         case "B6":
            var crtLen = parseInt("0x" + lcData.substr(offset + 2, 2));
            showAnalyseData += analyzeCRTforDS(lcData, offset, crtLen * 2);
            offset += 4 + crtLen * 2;
         break;
         case "9E":
            var tokenLen = parseInt("0x" + lcData.substr(offset + 4, 2));
            showAnalyseData += lcData.substr(offset, 2) + " " + lcData.substr(offset + 2, 4) + " [Delete Token] <br> " + TAB 
                     + lcData.substr(offset + 6, tokenLen * 2) + "<br>";
            offset += 6 + tokenLen * 2;
         break;
         case "D0":
            showAnalyseData += lcData.substr(offset, 2) + " " + lcData.substr(offset + 2, 2) + " " 
                            + lcData.substr(offset + 4, 2) + " [Key Identifier]" + "<br>";
            offset += 4 + 2;
         break;
         case "D2":
            showAnalyseData += lcData.substr(offset, 2) + " " + lcData.substr(offset + 2, 2) + " " 
                            + lcData.substr(offset + 4, 2) + " [Key Version Number]" + "<br>";
            offset += 4 + 2;
         break;
         default:
         break;
      };
   }

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, showAnalyseData + mac);

}

// 80CA2F00025C00
/*
0042 [Card Issuer or SD Provider Identifcation Number]
0045 [Card or Security Domain Image Number]
0066 [Card or Security Domain Management Data]
00E0 [Key Information Template]
00D3 [Current Security Level]
2F00 [List of Applications belonging to the SD or card]
FF21 [Extended Card Resources Information]
00C2 [Confirmation Counter]
00C1 [Sequence Counter of the default Key Version Number]
5F50 [Security Domain Manager URL - Amend C]
BF30 [Forwarded CASD Data - Amend C]
00CF [Key Derivation Data]
00EE [Card Profile Unique Identifier]
FF1F [Menu Parameters Tag]
FF20 [Card Resources Tag]
7F21 [Security Domain’s certificate store]
0067 [Card Capability Information] 
*/
function analyzeGetData(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [GET DATA]";

   var p1 = getP1(apduData);
   var p2 = getP2(apduData);
   var p1p2 = p1 + p2;

   switch (p1p2) {
   case "0042":
   p2 += " [Card Issuer or SD Provider Identifcation Number]";
   break;
   case "0045":
   p2 += " [Card or Security Domain Image Number]";
   break;
   case "0066":
   p2 += " [Card or Security Domain Management Data]";
   break;
   case "00E0":
   p2 += " [Key Information Template]";
   break;
   case "00D3":
   p2 += " [Current Security Level]";
   break;
   case "2F00":
   p2 += " [List of Applications belonging to the SD or Card]";
   break;
   case "FF21":
   p2 += " [Extended Card Resources Information]";
   break;
   case "00C2":
   p2 += " [Confirmation Counter]";
   break;
   case "00C1":
   p2 += " [Sequence Counter of the default Key Version Number]";
   break;
   case "5F50":
   p2 += " [Security Domain Manager URL - Amend C]";
   break;
   case "BF30":
   p2 += " [Forwarded CASD Data - Amend C]";
   break;
   case "00CF":
   p2 += " [Key Derivation Data]";
   break;
   case "00EE":
   p2 += " [Card Profile Unique Identifier]";
   break;
   case "FF1F":
   p2 += " [Menu Parameters Tag]";
   break;
   case "FF20":
   p2 += " [Card Resources Tag]";
   break;
   case "7F21":
   p2 += " [Security Domain’s certificate store]";
   break;
   case "0067":
   p2 += " [Card Capability Information]";
   break;
   default:
   break;
   }

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      if (lc >= 8) {
         lc -= 8;
         mac = apduData.substr(apduData.length - 16) + " [MAC]";
      }
   }
   var lcData = (lc > 0 ? getDataField(apduData, lc * 2) : "");

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, lcData + "<br>" + mac);
}
//80E288003B0070164202101045031111114F0412121212660515151515155F500416161616670318181800CF03A1A1A19F70010F8F0103A2A2A2910203A3A3A3
function analyzeStoreData(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [STORE DATA]";

   var p1 = getP1(apduData);
   var p2 = getP2(apduData);
   var p1Num = parseInt("0x" + p1);
   p1 += " [";
   if (p1Num & 0x80 == 0x80) {
      p1 += "Last block, ";
   } else {
      p1 += "More blocks, ";
   }
   switch (p1Num & 0x60) {
      case 0x00:
      p1 += "No general encryption information or non-encrypted data, ";
      break;
      case 0x20:
      p1 += "Application dependent encryption of the data, ";
      break;
      case 0x40:
      p1 += "RFU (encryption indicator), ";
      case 0x60:
      p1 += "Encrypted data, ";
      break;
   }
   switch (p1Num & 0x18) {
      case 0x00:
      p1 += "No general data structure information";
      break;
      case 0x08:
      p1 += "DGI format of the command data field";
      break;
      case 0x10:
      p1 += "BER -TLV format of the command data field ";
      case 0x18:
      p1 += "RFU (data structure information)";
      break;
   }
   p1 += "]";

   p2 += " [Block Number]";

/*
42 [Card Issuer or SD Provider Identifcation Number]
45 [Card or Security Domain Image Number]

4F [Issuer Security Domain AID]

66 [Card or Security Domain Management Data]

67 [Card Capability Information]

5F50 [Security Domain Manager URL - Amend C]

DGI
00CF [Key Derivation Data(10Bytes)]

9F70 [Card Life Cycle State(1Byte))]

8F01 [Secure Channel DES keys(48Bytes)]

7F01 [DES key related data(12Bytes)]

9102 [DAP Verification key data(129/131Bytes)]

0102 [DAP Verification key related data(6Bytes)]
*/

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      if (lc >= 8) {
         lc -= 8;
         mac = apduData.substr(apduData.length - 16) + " [MAC]";
      }
   }
   var lcData = (lc > 0 ? getDataField(apduData, lc * 2) : "");
   var offset = 0;
   var tag = "";
   var showAnalyseData = "";
   var tagLen = 0;
   //alert(lcData);
   if ((p1Num & 0x18) == 0x08) { // need bracket
      // DGI
      while (offset < lc * 2) {
         // DGI
         tag = lcData.substr(offset, 4); 
         tagLen = parseInt("0x" + lcData.substr(offset + 4, 2));
         switch (tag) {
         case "0070":
            showAnalyseData += analyzeStoreData0070(lcData, offset, tagLen * 2);
            offset += 6 + tagLen * 2;
         break;
         case "00CF":
            showAnalyseData += "00CF" + " " +  lcData.substr(offset + 4, 2) + " " + lcData.substr(offset + 6, tagLen * 2) + " [Key Derivation Data] <br>";
            offset += 6 + tagLen * 2;
         break;
         case "9F70":
            showAnalyseData += "9F70" + " " +  lcData.substr(offset + 4, 2) + " " + lcData.substr(offset + 6, tagLen * 2) + " [Card Life Cycle State] <br>";
            offset += 6 + tagLen * 2;
         break;
         case "8F01":
            showAnalyseData += "8F01" + " " +  lcData.substr(offset + 4, 2) + " " + lcData.substr(offset + 6, tagLen * 2) + " [Secure Channel DES keys] <br>";
            offset += 6 + tagLen * 2;
         break;
         case "9102":
            tagLen = parseInt("0x" + lcData.substr(offset + 4, 4));
            showAnalyseData += "9102" + " " +  lcData.substr(offset + 4, 4) + " " + lcData.substr(offset + 8, tagLen * 2) + " [DAP Verification key data] <br>";
            offset += 8 + tagLen * 2;
         break;
         default:
            showAnalyseData += tag + " " +  lcData.substr(offset + 4, 2) + " " + lcData.substr(offset + 6, tagLen * 2) + " [Custom DGI] <br>";
            offset += 6 + tagLen * 2;
         break;
         };
      }
   } else {
      // Genral Data Object
      showAnalyseData += analyzeGeneralDataObject(lcData, offset, lc * 2);
   }

   organizeDisplayDiv(cla, ins, p1, p2Hex, lcHex, showAnalyseData + mac);
}

function analyzeStoreData0070(lcData, offset, tagTotalLen) { // offset:0070 tag start position; tagTotalLen: the length start from tag data position
   var displayData = "0070 " + lcData.substr(offset + 4, 2) + " [One or more TLV coded objects] <br>";
   offset += 6;
   var tag;
   var lenHex;
   var len;
   var length = offset + tagTotalLen;

   displayData += analyzeGeneralDataObject(lcData, offset, length);

   return displayData;
}

function analyzeGeneralDataObject(lcData, offset, length) {
   var displayData = "";
   while (offset < length) {
      tag = lcData.substr(offset, 2);
      lenHex = lcData.substr(offset + 2, 2);
      len = parseInt("0x" + lenHex) * 2;

      switch (tag) {
      case "42":
         displayData += TAB + "42 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Card Issuer or SD Provider Identifcation Number] <br>";
         offset += 4 + len;
      break;
      case "45":
         displayData += TAB + "45 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Card or Security Domain Image Number] <br>";
         offset += 4 + len;
      break;
      case "4F":
         displayData += TAB + "4F " + lenHex + " " + lcData.substr(offset + 4, len) + " [Issuer Security Domain AID] <br>";
         offset += 4 + len;
      break;
      case "66":
         displayData += TAB + "66 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Card or Security Domain Management Data] <br>";
         offset += 4 + len;
         break;
      case "67":
         displayData += TAB + "67 " + lenHex + " " + lcData.substr(offset + 4, len) + " [Card Capability Information] <br>";
         offset += 4 + len;
         break;
      case "5F":
         // 5F50
         lenHex = lcData.substr(offset + 4, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + "5F50 " + lenHex + " " + lcData.substr(offset + 6, len) + " [Security Domain Manager URL - Amend C] <br>";
         offset += 6 + len;
          break;
      default:
         lenHex = lcData.substr(offset + 2, 2);
         len = parseInt("0x" + lenHex) * 2;
         displayData += TAB + tag + " " + lenHex + " " + lcData.substr(offset + 4, len) + " [Custom Tag] <br>";
         offset += 4 + len;
         break;
      }
   }

   return displayData;
}

// 80F280020C4F0512121212125C034F9F70
function analyzeGetStatus(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [GET STATUS]";

   var p1 = getP1(apduData);
   switch (p1) {
      case "80":
         p1 += " [Issuer Security Domain]";
      break;
      case "40":
         p1 += " [Applications, including Security Domains]";
      break;
      case "20":
         p1 += " [Executable Load Files]";
      break;
      case "10":
         p1 += " [Executable Load Files and Executable Modules]";
      break;
      case "08":
         p1 += " [Executable Load Files that are marked as “Logically Deleted with References”]";
      break;
      default:
      break;
   };

   var p2Hex = "0x" + getP2(apduData);
   var p2 = parseInt(p2Hex);
   p2Hex += " [";
   if ((p2 & 0x01) == 0x00) {
      p2Hex += "Get first or all occurrence(s), "
   } else {
      p2Hex += "Get next occurrence(s), "
   }
   if ((p2 & 0x02) == 0x00) {
      p2Hex += "Deprecated: response data structure according to Table 11-35  and  Table  11-37";
   } else {
      p2Hex += "Response data structure according to Table 11-36";
   }
   p2Hex += " ]";

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      if (lc >= 8) {
         lc -= 8;
         mac = apduData.substr(apduData.length - 16) + " [MAC]";
      }
   }
   var dataField = (lc > 0 ? getDataField(apduData, lc * 2) : "");

   var showAnalyseData = "";
   var offset = 0;
   var tag = "";
   var len = 0;
   var lenHex = "";
   while (offset < lc * 2) {
      tag = dataField.substr(offset, 2);
      lenHex = dataField.substr(offset + 2, 2);
      len = parseInt("0x" + lenHex);
      switch(tag) {
         case "4F":
            showAnalyseData += tag + " " + lenHex + " " + dataField.substr(offset + 4, len * 2) + " [Application AID]" + "<br>";
            offset += 4 + len * 2;
            break;
         case "5C":
            showAnalyseData += analyzeFilterCriteria(dataField, offset, len * 2);
            offset += 4 + len * 2;
            break;
         default:
            offset += 4 + len * 2;
            break;
      };
   }


   organizeDisplayDiv(cla, ins, p1, p2Hex, lcHex, showAnalyseData + mac);
}
/*
[4F]AID
[9F70]Application Life Cycle State
[C5]Privileges
[CF]Implicit Selection Parameters
[C4]Application’s Executable Load File AID
[CE]Executable Load File Version Number
[84]List of Executable Module AID
[CC]Associated Security Domain’s AID
[7F20]Display Control Template
[5F50]Uniform Resource Locator
[6D]Application Image Template
[5F45]Display Message
[A0]Application Group Head Application
[A1]Application Group Autho rization List
[A2]CREL Application AID List
[A3]Policy Restricted Applications
[A4]Application Group Members(excluding the Head Application)
[A5]Application discretionary data
[86]Application Family
[87]Assigned Protocols for implicit selection
[88]Initial Contactless Activation State
[A9]Contactless Protocol Parameters Profile
[8A]Recognition Algorithm
[8B]Continuous Processing
[AC]Communication Interface Access Parameters
[8D]Protocol Data Type A (Card Emulation Mode)
[8E]Protocol Data Type B (Card Emulation Mode)
[8F]Cumulative Granted Non- Volatile Memory
[90]Cumulative Granted Volatile Memory
[91]Cumulative Remaining Non- Volatile Memory
[92]Cumulative Remaining Volatile Memory
[93]Protocol Data Type F  (Card Emulation Mode)
*/
function analyzeFilterCriteria(dataField, offset, fcDataLen) { // offset:5C position, fcDataLen:V Data Length of 5CTLV.
   var displayData = "5C" + " " + dataField.substr(offset + 2, 2) + " " + " [Filter Criteria] <br>";
   offset += 4; // point to fcData begin offset
   var tag = "";
   var tagMeaning = "";
   var twoByteTag = false;
   var length = offset + fcDataLen;
   while (offset < length) {
      tag = dataField.substr(offset, 2);
      twoByteTag = false;
      switch(tag) {
         case "4F":
            tagMeaning = " [AID]";
            break;
         case "C5":
            tagMeaning = " [Privileges]";
            break;
         case "CF":
            tagMeaning = " [Implicit Selection Parameters]";
            break;
         case "C4":
            tagMeaning = " [Application’s Executable Load File AID]";
            break;
         case "CE":
            tagMeaning = " [Executable Load File Version Number]";
            break;
         case "84":
            tagMeaning = " [List of Executable Module AID]";
            break;
         case "CC":
            tagMeaning = " [Associated Security Domain’s AID]";
            break;
         case "6D":
            tagMeaning = " [Application Image Template]";
            break;
         case "A0":
            tagMeaning = " [Application Group Head Application]";
            break;
         case "A1":
            tagMeaning = " [Application Group Autho rization List]";
            break;
         case "A2":
            tagMeaning = " [CREL Application AID List]";
            break;
         case "A3":
            tagMeaning = " [Policy Restricted Applications]";
            break;
         case "A4":
            tagMeaning = " [Application Group Members(excluding the Head Application)]";
            break;
         case "A5":
            tagMeaning = " [Application discretionary data]";
            break;
         case "86":
            tagMeaning = " [Application Family]";
            break;
         case "87":
            tagMeaning = " [Assigned Protocols for implicit selection]";
            break;
         case "88":
            tagMeaning = " [Initial Contactless Activation State]";
            break;
         case "A9":
            tagMeaning = " [Contactless Protocol Parameters Profile]";
            break;
         case "8A":
            tagMeaning = " [Recognition Algorithm]";
            break;
         case "8B":
            tagMeaning = " [Continuous Processing]";
            break;
         case "AC":
            tagMeaning = " [Communication Interface Access Parameters]";
            break;
         case "8D":
            tagMeaning = " [Protocol Data Type A (Card Emulation Mode)]";
            break;
         case "8E":
            tagMeaning = " [Protocol Data Type B (Card Emulation Mode)]";
            break;
         case "8F":
            tagMeaning = " [Cumulative Granted Non- Volatile Memory]";
            break;
         case "90":
            tagMeaning = " [Cumulative Granted Volatile Memory]";
            break;
         case "91":
            tagMeaning = " [Cumulative Remaining Non- Volatile Memory]";
            break;
         case "92":
            tagMeaning = " [Cumulative Remaining Volatile Memory]";
            break;
         case "93":
            tagMeaning = " [Protocol Data Type F  (Card Emulation Mode)]";
            break;

         case "9F": // 9F70
         case "7F": // 7F20
         case "5F": // 5F50/5F45
            twoByteTag = true;
            tag = dataField.substr(offset, 4);
            if (tag == "9F70") { // 9F70
               tagMeaning = " [Application Life Cycle State]";
            }
            if (tag == "7F20") { // 7F20
               tagMeaning = " [Display Control Template]";
            }
            if (tag == "5F50") {
               tagMeaning = " [Uniform Resource Locator]";
            } 
            if (tag == "5F45") {
               tagMeaning = " [Display Message]";
            } 

            displayData += TAB + tag + " " + tagMeaning + "<br>";
            offset += 4;
            break;
         default:
            break;
      };

      if (!twoByteTag) {
         displayData += TAB + tag + " " + tagMeaning + "<br>";
         offset += 2
      }

   }

   return displayData;
}


function analyzeSetStatus(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [SET STATUS]";

   var p1 = getP1(apduData);
   var original_p1 = p1;
   switch (p1) {
      case "80":
         p1 += " [Indicate Issuer Security Domain]";
      break;
      case "40":
         p1 += " [Indicate Application or Supplementary  Security Domain]";
      break;
      case "60":
         p1 += " [Indicate Security Domain and its associated Applications]";
      break;
      default:
      break;
   };

   var p2Hex = getP2(apduData);
   var original_p2 = p2Hex;
   var p2 = parseInt("0x" + p2Hex);
   if (original_p1 == "80") {
      // ISD
      switch (p2Hex) {
         case "01":
            p2Hex += " [OP_READY]";
            break;
         case "07":
            p2Hex += " [INITIALIZED]";
            break;
         case "0F":
            p2Hex += " [SECURED]";
            break;
         case "7F":
            p2Hex += " [CARD_LOCKED]";
            break;
         case "FF":
            p2Hex += " [TERMINATED]";
            break;
         default:
            break;
      }
   } else if (original_p1 == "40") {
      // Application
      p2Hex += " [";
      if ((p2 & 0x80) == 0x80) {
         p2Hex += "Application/SD LOCKED, ";
      }
      switch (original_p2) {
         case "03":
            p2Hex += "Application/SD INSTALLED";
            break;
         /*
         case "80";
            p2Hex += " Application/SD LOCKED";
            break;
         */
         case "07":
            p2Hex += "Application/SD SELECTABLE";
            break;
         case "0F":
            p2Hex += "SD PERSONALIZED";
            break;
         default:
            break;
      }
      p2Hex += "]";
   } else if (original_p1 == "60") {
      // SD and its associated Applications
      if ((p2 & 0x80) == 0x80) {
         p2Hex += " [LOCKED]";
      } else {
         p2Hex += " [UNLOCKED]";
      }
   }

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      if (lc >= 8) {
         lc -= 8;
         mac = apduData.substr(apduData.length - 16) + " [MAC]";
      }
   }
   var dataField = (lc > 0 ? getDataField(apduData, lc * 2) + " [AID of Application or SD]" : "");

   organizeDisplayDiv(cla, ins, p1, p2Hex, lcHex, dataField + "<br>" + mac);
}

// 84D800814B208010B3CDA79EAFDA2414BDE9D7E927F020AF038BAF478010B3CDA79EAFDA2414BDE9D7E927F020AF038BAF478010B3CDA79EAFDA2414BDE9D7E927F020AF038BAF4762C3ED0D45C33862
// 84D870018F70A180C183DD7A0B0510243879F9E1C7DF1BB8E0FF5AEDB2D6C6CADC44DED82E3B881352D06B9FF9DDC0AD68FA152808A10119A8A4F2C2964C201402D2FB6846CA065842FB2316B90305474E36BF562D2028BE19C3799F3714AF1BA08F93DD435F517211CABDFB00615323DDB1EE4BFC992770CE3FE5429B0B4EB24B0008C6A005648B03261E08C88A9A01B4233AF7
function analyzePutKey(apduData) {
   //alert(apduData);
   //$("#ins").html(INS_PUT_KEY);
    var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [Put Key]";

   var p1 = getP1(apduData);
   var p1Num = parseInt("0x" + p1);
   p1 += " [";
   if (p1Num & 0x80 == 0x80) {
      p1 += "More PUT KEY commands, ";
   } else {
      p1 += "Last (or only) command, ";
   }
   p1 += "Key Version Number: 0x" + numToHexString(p1Num & 0x7F)
   p1 += "]";

   var p2 = getP2(apduData);
   var p2Num = parseInt("0x" + p2);
   p2 += " ["
   if (p2Num & 0x80 == 0x80) {
      p2 += "Multiple keys, ";
   } else {
      p2 += "Single key, ";
   }
   p2 += "Key Identifier: 0x" + numToHexString(p2Num & 0x7F)
   p2 += "]";

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      lc -= 8;
      mac = apduData.substr(apduData.length - 16) + " [MAC]";
   }
   var lcData = getDataField(apduData, lc * 2);
   var showAnalyseData = "";
   var offset = 0;
   var format2 = false;
   var rsaKey = false;

   // New version number
   var data = lcData.substr(offset, 2);
   showAnalyseData += data + " [New version number]" + "<br>";
   offset += 2;

   // key data field
   while (offset < lc * 2) {
      // Key Type
      data = lcData.substr(offset, 2);
      if (data == "FF") {
         format2 = true;
         offset += 2;
         data = lcData.substr(offset, 2);
      }
      showAnalyseData += data + " [Key Type] ";
      // Key Length
      offset += 2;
      data = lcData.substr(offset, 2);
      var keyLength = parseInt("0x" + data);
      showAnalyseData += data + " [Key Length] ";
      // Key Data
      offset += 2;
      data = lcData.substr(offset, keyLength * 2);
      showAnalyseData += data + " [Key Data] ";

      // CheckValue
      offset += keyLength * 2;
      var checkValueLength = parseInt("0x" + lcData.substr(offset, 2));
      data = lcData.substr(offset, 2 + checkValueLength * 2);
      showAnalyseData += data + " [Key check value LV] ";
      offset += 2 + checkValueLength * 2;

      // Key usage  qualifier & Key access 
      if (format2) {
         data = lcData.substr(offset, 4);
         showAnalyseData += data + " [Key usage  qualifier LV] ";
         offset += 4;
         data = lcData.substr(offset, 4);
         showAnalyseData += data + " [Key access LV] ";
         offset += 4;
      }

      showAnalyseData += "<br>";
   }

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, showAnalyseData + mac);
}

function analyzeInitializeUpdate(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [INITIALIZE UPDATE]";

   var p1 = getP1(apduData);
   p1 += " [Key Version Number]";
   var p2 = getP2(apduData);

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);

   var dataField = (lc > 0 ? getDataField(apduData, lc * 2) + " [Host challenge ]" : "");

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, dataField);
}
function analyzeExternalAuthenticate(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [EXTERNAL AUTHENTICATE]";

   var p1 = getP1(apduData);
   switch (p1) {
      case "00":
         p1 += " [Security Level: No secure messaging expected]";
      break;
      case "01":
         p1 += " [Security Level: C-MAC]";
      break;
      case "03":
         p1 += " [Security Level: C-DECRYPTION and C-MAC]";
      break;
      case "10":
         p1 += " [Security Level: R-MAC]";
      break;
      case "11":
         p1 += " [Security Level: C-MAC and R-MAC]";
      break;
      case "13":
         p1 += " [Security Level: C-DECRYPTION, C-MAC and R-MAC]";
      break;
      default:
      break;
   }
  
   var p2 = getP2(apduData);
   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);

   var dataField = (lc > 0 ? getDataField(apduData, lc * 2) + " [Host cryptogram(8Byte) and MAC(8Byte)]" : "");

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, dataField);
}
function analyzeBeginRmacSession(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [BEGIN R-MAC SESSION]";

   var p1 = getP1(apduData);
   switch (p1) {
      case "00":
         p1 += " [No secure messaging expected]";
      break;
      case "10":
         p1 += " [R-MAC]";
      break;
      case "30":
         p1 += " [Response Encryption and R- MAC (RFU)]";
      break;
      default:
      break;
   }
  
   var p2 = getP2(apduData);
   if (p2 == "01") {
      p2 += " [Begin R-MAC session]";
   }

   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      if (lc >= 8) {
         lc -= 8;
         mac = apduData.substr(apduData.length - 16) + " [MAC]";
      }
   }
   var dataField = (lc > 0 ? getDataField(apduData, lc * 2) + " [Data Field LV]" : "");

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, dataField + "<br>" + mac);
}
function analyzeEndRmacSession(apduData) {
   var cla = getCla(apduData);
   var ins = getIns(apduData);
   ins += " [END R-MAC SESSION]";


   var p1 = getP1(apduData);
   var p2 = getP2(apduData);
   switch (p2) {
      case "01":
         p2 += " [Return R-MAC]";
      break;
      case "03":
         p2 += " [End R-MAC session & return R-MAC]";
      break;
      default:
      break;
   }
  
   var lcHex = "0x" + getLc(apduData);
   var lc = parseInt(lcHex);
   var mac = "";
   if (cla == "84") {
      if (lc >= 8) {
         lc -= 8;
         mac = apduData.substr(apduData.length - 16) + " [MAC]";
      }
   }

   var dataField = (lc > 0 ? getDataField(apduData, lc * 2) : "");

   organizeDisplayDiv(cla, ins, p1, p2, lcHex, dataField + "<br>" + mac);
}

/* Analyze GP Response APDU Function */
/*
   '6F' File Control Information (FCI template)                         Mandatory
         '84' Application / file AID                                    Mandatory
         'A5' Proprietary data                                          Mandatory
               '73' Security Domain Management Data                     Optional
               '9F6E' Application production Life Cycle data            Optional
               '9F65' Maximum length of data field in command message   Mandatory

   Support Response for Select GP-CRS Application for AmendC
      6F' File Control Information (FCI template)                       Mandatory
         '84' Application / file AID                                    Mandatory
         'A5' Proprietary data                                          Mandatory
               '9F08' Version number (2 bytes)                          Mandatory
               '80'   Global Update Counter                             Mandatory
*/
/* 6F108408A000000151000000A5049F6501FF */
function analyzeSelectResponse(apduData) {
   //alert(apduData);
   var analyzeResult = "";
   var offset = 0;
   var tag = apduData.substr(offset, 2);
   var len = 0;
   var tagLen = 0;

   if (tag == "6F") {
      offset += 2;
      len = parseInt("0x" + apduData.substr(offset, 2));
      analyzeResult += "6F" + " " +  apduData.substr(offset, 2) + " [File Control Information] <br>";

      offset += 2;
      while (offset < len * 2) {
         tag = apduData.substr(offset, 2);
         tagLen = parseInt("0x" + apduData.substr(offset + 2, 2));
         
         switch (tag) {
            case "84":
               analyzeResult += TAB + "84" + " " +  apduData.substr(offset + 2, 2) + " " + apduData.substr(offset + 4, tagLen * 2) + " [Application AID] <br>";
               break;
            case "A5":
               analyzeResult += TAB + analyzeSelectRespDataA5(apduData, offset, tagLen * 2);
               break;
            default:
               alert("Not Supported Tag:" + tag);
               return;
         }

         offset += 4 + tagLen * 2;
      }
   }
   else {
      alert("Not Supported Tag:" + tag);
      return;
   }

   $("#data_field").html(analyzeResult);
}

function analyzeSelectRespDataA5(data, offset, tagTotalLen) {
   var displayData = "A5 " + data.substr(offset + 2, 2) + " [Proprietary data] <br>";
   offset += 4;
   var tag;
   var tagLen;
   var length = offset + tagTotalLen;

   while (offset < length) {
      tag = data.substr(offset, 2);
      tagLen = parseInt("0x" + data.substr(offset + 2, 2));

      switch(tag) {
         case "73":
            displayData += TAB2 + "73" + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [Security Domain Management Data] <br>";
            break;
         case "80":
            displayData += TAB2 + "80" + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [Global Update Counter(big endian) - CRS Application] <br>";
            break;
         case "9F":
            tag = data.substr(offset + 2, 2);
            tagLen = parseInt("0x" + data.substr(offset + 4, 2));
            if (tag == "6E") {
               displayData += TAB2 + "9F6E" + " " + data.substr(offset + 4, 2) + " " + data.substr(offset + 6, tagLen * 2) + " [Application production Life Cycle data] <br>";
               offset += 2;
               break;
            } else if (tag == "65") {
               displayData += TAB2 + "9F65" + " " + data.substr(offset + 4, 2) + " " + data.substr(offset + 6, tagLen * 2) + " [Maximum length of data field in command message] <br>";
               offset += 2;
               break;
            } else if (tag == "08") {
               displayData += TAB2 + "9F08" + " " + data.substr(offset + 4, 2) + " " + data.substr(offset + 6, tagLen * 2) + " [Version number (2 bytes) - CRS Application] <br>";
               offset += 2;
               break;
            }
         default:
            displayData += TAB2 + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [No Meaning] <br>";
            break;
      }

      offset += 4 + tagLen * 2; 
   }

   return displayData;
}

/*
   SCP02:
      Key diversification data 10 bytes
      Key information          2 bytes
      Sequence Counter         2 bytes
      Card challenge           6 bytes
      Card cryptogram          8 bytes

   SCP03:
      Key diversification data 10 bytes Mandatory
      Key information          3 bytes Mandatory
      Card challenge           8 bytes Mandatory
      Card cryptogram          8 bytes Mandatory
      Sequence Counter         3 bytes Conditional
*/
/*
SCP02:FFFFFFFFFFFFFFFFFFFF200200008BA2FFCEA96C739814C181D26E4A
SCP03:FFFFFFFFFFFFFFFFFFFF20021000008BA2FFCEA96C739814C181D26E4A000001
*/
function analyzeInitializeUpdateResponse(apduData) {
   //alert(apduData);
   var length = apduData.length;
   var analyzeResult = "";
   var offset = 0;
   
   if (length == 28 * 2) {
      // SCP02
      analyzeResult += apduData.substr(offset, 20) + " [Key diversification data] <br>";

      offset += 20;
      analyzeResult += apduData.substr(offset, 4) + " [Key information, KVN:" + apduData.substr(offset, 2) + "; SCP Identifier:" + apduData.substr(offset + 2, 2) + "] <br>";
      
      offset += 4;
      analyzeResult += apduData.substr(offset, 4) + " [Sequence Counter] <br>";

      offset += 4;
      analyzeResult += apduData.substr(offset, 12) + " [Card challenge] <br>";

      offset += 12;
      analyzeResult += apduData.substr(offset, 16) + " [Card cryptogram]";
   } else {
      // SCP03
      analyzeResult += apduData.substr(offset, 20) + " [Key diversification data] <br>";

      offset += 20;
      analyzeResult += apduData.substr(offset, 6) + " [Key information, KVN:" + apduData.substr(offset, 2) + "; SCP Identifier:" + apduData.substr(offset + 2, 2) + "; SCP i:" + apduData.substr(offset + 4, 2) + "] <br>";
      
      offset += 6;
      analyzeResult += apduData.substr(offset, 16) + " [Card challenge] <br>";

      offset += 16;
      analyzeResult += apduData.substr(offset, 16) + " [Card cryptogram] <br>";

      if (offset < length) {
          offset += 16;
          analyzeResult += apduData.substr(offset, 6) + " [Sequence Counter]";
      }
   }

   $("#data_field").html(analyzeResult);
}

/*
Support Response for get data
[
 0042 [Card Issuer or SD Provider Identifcation Number] 
   Example: 42074953445F49494E
 0045 [Card or Security Domain Image Number] 
   Example: 45074953445F43494E
 00D3 [Current Security Level]
   Example: D30180
 00C2 [Confirmation Counter]  
   Example: C2020001
 00C1 [Sequence Counter of Default Key Version Number] 
   Example: C1020005
 00CF [Key Derivation Data] 
   Example: CF0AFFFFFFFFFFFFFFFFFFFF
 
 00E0 [Key Information Template] 
   Example: E018C00401208010C00402208010C00403208010C00401718010
 0066 [Card or Security Domain Management Data]
 0067 [Card Capability Information] 

 FF1F [Menu Parameters Tag - UICC] 
   Example:FF1F06010102020303 [item position + item identifier]
 FF20 [Card Resources Tag - UICC] 
   Example: FF20037FFF0F
 FF21 [Extended Card Resources Information - UICC] 
   Example: FF210D81010F82040000E7FB830202AE
 2F00 [List of Applications belonging to the SD or card] 
   Example: 610A4F08A00000015100000061124F1057617463684461746141707000000001
 00EE [Card Profile Unique Identifier] 
 BF30 [Forwarded CASD Data]

 5F50 [Security Domain Manager URL] 
   Example:5F5006112233445566 
 7F21 [Security Domain’s certificate store - GP SCP10] 
]
*/
function analyzeGetDataResponse(apduData) { 
   var analyzeResult = "";
   var offset = 0;
   var tag_2byte = apduData.substr(offset, 4);
   var tag1 = apduData.substr(offset, 2);
   var len = 0;
   var tagLen = 0;
   var tagMeaning = "";

   switch (tag_2byte) 
   {
      case "FF1F":
         tagLen = parseInt("0x" + apduData.substr(offset + 4, 2));
         analyzeResult += analyzeGetDataRespDataFF1F(apduData, offset, tagLen * 2);
         break;
      case "FF20":   
         tagLen = parseInt("0x" + apduData.substr(offset + 4, 2));
         analyzeResult += analyzeGetDataRespDataFF20(apduData, offset, tagLen * 2);
         break;
      case "FF21":
         tagLen = parseInt("0x" + apduData.substr(offset + 4, 2));
         analyzeResult += analyzeGetDataRespDataFF21(apduData, offset, tagLen * 2);
         break;
      case "5F50":
      case "7F21":
      case "BF30":
         offset += 4;
         len = parseInt("0x" + apduData.substr(offset, 2));
         if (tag_2byte == "5F50") {
            tagMeaning = "Security Domain Manager URL";
         } else if (tag_2byte == "7F21") {
            tagMeaning = "Security Domain’s certificate store";
         } else if(tag_2byte == "BF30") {
            tagMeaning = "Forwarded CASD Data";
         }
         analyzeResult += tag_2byte + " " +  apduData.substr(offset, 2) + " [" + tagMeaning + "] <br>";
         analyzeResult += TAB + apduData.substr(offset + 2, len * 2);
         break;
      default:
         tagLen = parseInt("0x" + apduData.substr(offset + 2, 2));
         if (tag1 == "E0") {
            analyzeResult += analyzeGetDataRespDataE0(apduData, offset, tagLen * 2);
         } else if (tag1 == "61") {
             /*
             2F00 [List of Applications belonging to the SD or card] 
             Example: 610A4F08A00000015100000061124F1057617463684461746141707000000001
             */
            analyzeResult += analyzeGetDataRespData2F00(apduData, offset, apduData.length);
            break;
         } else {
            switch(tag1) 
            {
               case "66":
                  tagMeaning = "Card or Security Domain Management Data";
                  break;
               case "67":
                  tagMeaning = "Card Capability Information";
                  break;
               case "42":
                  tagMeaning = "Card Issuer or SD Provider Identifcation Number";
                  break;
               case "45":
                  tagMeaning = "Card or Security Domain Image Number";
                  break;
               case "C1":
                  tagMeaning = "Sequence Counter of Default Key Version Number";
                  break;
               case "C2":
                  tagMeaning = "Confirmation Counter";
                  break;
               case "D3":
                  tagMeaning = "Current Security Level";
                  break;
               case "CF":
                  tagMeaning = "Key Derivation Data";
                  break;
               case "EE":
                  break;
                  tagMeaning = "Card Profile Unique Identifier";
               default:
                  break;
            }

            offset += 2;
            len = parseInt("0x" + apduData.substr(offset, 2));
            analyzeResult += tag1 + " " +  apduData.substr(offset, 2) + " [" + tagMeaning + "] <br>";
            analyzeResult += TAB + apduData.substr(offset + 2, len * 2);
         }
         break;
   }

   $("#data_field").html(analyzeResult);
}
/*
00E0 [Key Information Template] 
   Example: E018C00401208010C00402208010C00403208010C00401718010 [Format1]
            E020C0060120FF800010C0060220FF800010C0060320FF800010C0060171FF800010 [Format2]
*/
function analyzeGetDataRespDataE0(data, offset, tagTotalLen) {
   var displayData = "E0 " + data.substr(offset + 2, 2) + " [Key Information Template] <br>";
   offset += 4;
   var tag;
   var tagLen;
   var length = offset + tagTotalLen;

   while (offset < length) {
      tag = data.substr(offset, 2);
      tagLen = parseInt("0x" + data.substr(offset + 2, 2));
      displayData += TAB + tag + " " +  data.substr(offset + 2, 2) + " " + 
                     data.substr(offset + 4, tagLen * 2) + " [Key Information Data: KID + KVN + KeyType + KeyLength] <br>";
      offset += 4 + tagLen * 2; 
   }

   return displayData;
}
/*
 2F00 [List of Applications belonging to the SD or card] 
 Example: 610A4F08A00000015100000061124F1057617463684461746141707000000001
 */
function analyzeGetDataRespData2F00(data, offset, tagTotalLen) {
   var displayData = "";
   var tag;
   var tagLen;
   var length = offset + tagTotalLen;

   while (offset < length) {
      tag = data.substr(offset, 2);
      tagLen = parseInt("0x" + data.substr(offset + 2, 2));

      switch(tag) {
         case "61":
            displayData += TAB + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [Application TLV] <br>";
            break;
         default:
            displayData += TAB + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [No Meaning] <br>";
            break;
      }

      offset += 4 + tagLen * 2; 
   }

   return displayData;
}
/*
 FF1F [Menu Parameters Tag - UICC] 
   Example:FF1F06010102020303 [item position + item identifier]
 FF20 [Card Resources Tag - UICC] 
   Example: FF20037FFF0F [Free E2PROM, Number of installed applets]
 FF21 [Extended Card Resources Information - UICC] 
   Example: FF210D81010F82040000E7FB830202AE
   // Number of installed application   81
   // Free non volatile memory          82
   // Free volatile memory              83
*/
function analyzeGetDataRespDataFF1F(data, offset, tagTotalLen) {
   var displayData = "FF1F " + data.substr(offset + 4, 2) + " [Menu Parameters Tag] <br>";
   offset += 6;
   var length = offset + tagTotalLen;

   while (offset < length) {
      displayData += TAB + data.substr(offset, 2 * 2) + " [Item position(1) + Item identifier(1)] <br>";
      offset += 2 * 2; 
   }

   return displayData;
}
function analyzeGetDataRespDataFF20(data, offset, tagTotalLen) {
   var displayData = "FF20 " + data.substr(offset + 4, 2) + " [Card Resources Tag] <br>";
   offset += 6;
   displayData += TAB + data.substr(offset, tagTotalLen) + " [Free E2PROM(2) + Number of installed applets(1)] <br>";
   return displayData;
}
function analyzeGetDataRespDataFF21(data, offset, tagTotalLen) {
   var displayData = "FF21 " + data.substr(offset + 4, 2) + " [Extended Card Resources Information] <br>";
   offset += 6;
   var tag;
   var tagLen;
   var length = offset + tagTotalLen;

   while (offset < length) {
      tag = data.substr(offset, 2);
      tagLen = parseInt("0x" + data.substr(offset + 2, 2));

      switch(tag) {
         case "81":
            displayData += TAB2 + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [Number of installed application] <br>";
            break;
         case "82":
            displayData += TAB2 + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [Free non volatile memory] <br>";
            break;
         case "83":
            displayData += TAB2 + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [Free volatile memory] <br>";
            break;
         default:
            displayData += TAB2 + tag + " " +  data.substr(offset + 2, 2) + " " + data.substr(offset + 4, tagLen * 2) + " [No Meaning] <br>";
            break;
      }

      offset += 4 + tagLen * 2; 
   }

   return displayData;
}

/*
   Support LV & TLV Format, but for LV structure, not support get status for ELF with EM response data
   LV Format:
   0BA0000001514341696430330F800BA0000001514341696430310F80

   TLV Format:
   E3294F0BA00000015143456C6630309F700101840AA00000015143456D3030840AA00000015143456D3031
   E3 29 
      4F0BA00000015143456C663030
      9F700101
      840AA00000015143456D3030
      840AA00000015143456D3031

   E3174F0BA0000001514341696430339F70020700C503808000E3174F0BA0000001514341696430319F70020700C503808000
*/
function analyzeGetStatusResponse(apduData) {
   var analyzeResult = "";
   var offset = 0;
   var tag = apduData.substr(offset, 2);
   var len = apduData.length;
   var e3TagLen = 0;
   var tagLen = 0;
   var tagMeaning;

   if (tag == "E3") {
      // TLV structure [may have more E3_TLV]
      while (offset < len) {
         offset += 2;
         e3TagLen = parseInt("0x" + apduData.substr(offset, 2));
         analyzeResult += "E3" + " " +  apduData.substr(offset, 2) + " [GlobalPlatform Registry related data] <br>";
         offset += 2;

         e3TagLen = (e3TagLen * 2 + offset);
         while (offset < e3TagLen) {
            tagMeaning = "";
            tag = apduData.substr(offset, 2);
            tagLen = parseInt("0x" + apduData.substr(offset + 2, 2));

            if (tag == "9F" || tag == "7F" || tag == "5F") {
               tag = apduData.substr(offset, 4);
               tagLen = parseInt("0x" + apduData.substr(offset + 4, 2));

               if (tag == "9F70") {
                  // "9F70"
                  tagMeaning = "Life Cycle State";
               } else if (tag == "7F20") {
                  // "7F20"
                  tagMeaning = "Display Control Template - AmendC";
               } else if (tag == "5F50") {
                  tagMeaning = "Uniform Resource Locator - AmendC";
               } else if (tag == "5F45") {
                  tagMeaning = "Display Message - AmendC";
               }
               analyzeResult += TAB + tag + " " + apduData.substr(offset + 4, 2) + " " + apduData.substr(offset + 6, tagLen * 2) + " [" + tagMeaning + "] <br>";
               offset += 6 + tagLen * 2;
            } else {
               switch (tag) {
                  case "4F":
                     tagMeaning = "AID";
                     break;
                  case "C5":
                     tagMeaning = "Privileges";
                     break;
                  case "CF":
                     tagMeaning = "Implicit Selection Parameter";
                     break;
                  case "C4":
                     tagMeaning = "Application’s Executable Load File AID";
                     break;
                  case "CC":
                     tagMeaning = "Associated Security Domain’s AID";
                     break;
                  case "CE":
                     tagMeaning = "Executable Load File Version Number";
                     break;
                  case "84":
                     tagMeaning = "Executable Module AID";
                     break;
                  case "8F":
                     tagMeaning = "Cumulative Granted Non-Volatile Memory";
                     break;
                  case "90":
                     tagMeaning = "Cumulative Granted Volatile Memory";
                     break;
                  case "91":
                     tagMeaning = "Cumulative Remaining Non-Volatile Memory";
                     break;
                  case "92":
                     tagMeaning = "Cumulative Remaining Volatile Memory";
                     break;
                  case "EA":
                     tagMeaning = "SCP Registry Data - UICC";
                     break;
                  case "6D":
                     tagMeaning = "Application Image Template - AmendC";
                     break;
                  case "A0":
                     tagMeaning = "Application Group Head Application - AmendC";
                     break;   
                  case "A1":
                     tagMeaning = "Application Group Authorization List - AmendC";
                     break;   
                  case "A2":
                     tagMeaning = "CREL Application AID List - AmendC";
                     break;  
                  case "A3":
                     tagMeaning = "Policy Restricted Applications - AmendC";
                     break;
                  case "A4":
                     tagMeaning = "Application Group Members - AmendC";
                     break;
                  case "A5":
                     tagMeaning = "Application discretionary data - AmendC";
                     break;
                  case "86":
                     tagMeaning = "Application Family - AmendC";
                     break;
                  case "87":
                     tagMeaning = "Assigned Protocols for implicit selection - AmendC";
                     break;
                  case "88":
                     tagMeaning = "Initial Contactless Activation State - AmendC";
                     break;
                  case "89":
                     tagMeaning = "Contactless Protocol Type State - AmendC";
                     break;
                  case "A9":
                     tagMeaning = "Contactless Protocol Parameters Profile - AmendC";
                     break;
                  case "8A":
                     tagMeaning = "Recognition Algorithm - AmendC";
                     break;
                  case "8B":
                     tagMeaning = "Continuous Processing - AmendC";
                     break;
                  case "AC":
                     tagMeaning = "Communication Interface Access Parameters - AmendC";
                     break;
                  case "8D":
                     tagMeaning = "Protocol Data Type A (Card Emulation Mode) - AmendC";
                     break;
                  case "8E":
                     tagMeaning = "Protocol Data Type B (Card Emulation Mode) - AmendC";
                     break;
                  case "93":
                     tagMeaning = "Protocol Data Type F (Card Emulation Mode) - AmendC";
                     break;
                  default:
                     tagMeaning = "NoMeaning";
                     return;
               }
               analyzeResult += TAB + tag + " " + apduData.substr(offset + 2, 2) + " " + apduData.substr(offset + 4, tagLen * 2) + " [" + tagMeaning + "] <br>";
               offset += 4 + tagLen * 2;
            }
         }
      }
      
   }
   else {
      // LV structure, not support get status for ELF with EM response data
      while (offset < len) {
         tagLen = parseInt("0x" + apduData.substr(offset, 2));
         analyzeResult += apduData.substr(offset, 2) + " " + apduData.substr(offset + 2, 2 * tagLen) + " [AID LV] " +
                         " " + apduData.substr(offset + 2 + 2 * tagLen, 2) + " [Life Cycle State] " + 
                         " " + apduData.substr(offset + 4 + 2 * tagLen, 2) + " [Privileges] <br>";
         offset += 6 + tagLen * 2;
      }
   }

   $("#data_field").html(analyzeResult);
}

/* 
   CRS Get Data Command Response
   A5099F0802010080020001 
*/
function analyzeCRSGetDataResponse(apduData) {
   var analyzeResult = "";
   var offset = 0;
   var tag = apduData.substr(offset, 2);
   var len = 0;
   var tagLen = 0;

   if (tag == "A5") {
      offset += 2;
      len = parseInt("0x" + apduData.substr(offset, 2));
      analyzeResult += tag + " " +  apduData.substr(offset, 2) + " [FCI Proprietary Template] <br>";

      offset += 2;
      while (offset < len * 2) {
         tag = apduData.substr(offset, 2);
         tagLen = parseInt("0x" + apduData.substr(offset + 2, 2));
         
         switch (tag) {
            case "9F":
               tag = apduData.substr(offset, 4);
               tagLen = parseInt("0x" + apduData.substr(offset + 4, 2));

               if (tag == "9F08") {
                  analyzeResult += TAB + tag + " " + apduData.substr(offset + 4, 2) + " " + apduData.substr(offset + 6, tagLen * 2) + " [Version number (2 bytes)] <br>";
                  offset += 2;
               } 
               break;
            case "80":
               analyzeResult += TAB + tag + " " +  apduData.substr(offset + 2, 2) + " " + apduData.substr(offset + 4, tagLen * 2) + " [Global Update Counter (big endian)] <br>";
               break;
            default:
               analyzeResult += TAB + tag + " " +  apduData.substr(offset + 2, 2) + " " + apduData.substr(offset + 4, tagLen * 2) + " [No Meaning] <br>";
               break;
         }

         offset += 4 + tagLen * 2;
      }
   }
   else {
      alert("Not Supported Tag:" + tag);
      return;
   }

   $("#data_field").html(analyzeResult);
}

/* 
   CRS Get Status Command Response
   61344F0CA000000151434C41420101019F700207018002000081011DA40E4F0CA0000001514352454C0101018701008801008A020000 
*/
function analyzeCRSGetStatusResponse(apduData) {
   var analyzeResult = "";
   var offset = 0;
   var tag = apduData.substr(offset, 2);
   var len = apduData.length;
   var fcpTagLen = 0;
   var tagLen = 0;
   var tagMeaning;

   if (tag == "61") {
      while (offset < len) {
         offset += 2;
         fcpTagLen = parseInt("0x" + apduData.substr(offset, 2));
         analyzeResult += "61" + " " +  apduData.substr(offset, 2) + " [Application related data] <br>";
         offset += 2;

         fcpTagLen = (fcpTagLen * 2 + offset);
         while (offset < fcpTagLen) {
            tagMeaning = "";
            tag = apduData.substr(offset, 2);
            tagLen = parseInt("0x" + apduData.substr(offset + 2, 2));

            if (tag == "9F" || tag == "7F" || tag == "5F") {
               tag = apduData.substr(offset, 4);
               tagLen = parseInt("0x" + apduData.substr(offset + 4, 2));
               if (tag == "9F70") {
                  // "9F70"
                  tagMeaning = "Application Lifecycle State";
               } else if (tag == "7F20") {
                  // "7F20"
                  tagMeaning = "Display Control Template (including all available sub-tags and their values)";
               } else if (tag == "5F50") {
                  // "5F50"
                  tagMeaning = "Uniform Resource Locator";
               } else if (tag == "5F45") {
                  // "5F45"
                  tagMeaning = "Display Message";
               } 
               analyzeResult += TAB + tag + " " + apduData.substr(offset + 4, 2) + " " + apduData.substr(offset + 6, tagLen * 2) + " [" + tagMeaning + "] <br>";
               offset += 6 + tagLen * 2;
            } else {
               switch (tag) {
                  case "4F":
                     tagMeaning = "AID";
                     break;
                  case "80":
                     tagMeaning = "Application Update Counter (big endian)";
                     break;
                  case "6D":
                     tagMeaning = "Application Image Template";
                     break;
                  case "81":
                     tagMeaning = "Selection Priority";
                     break;
                  case "A2":
                     tagMeaning = "Group Head Application";
                     break;
                  case "A3":
                     tagMeaning = "Group Member’s Application";
                     break;
                  case "A4":
                     tagMeaning = "CREL Application AID List";
                     break;
                  case "A5":
                     tagMeaning = "Policy Restricted Applications";
                     break;
                  case "A6":
                     tagMeaning = "Application Discretionary Data";
                     break;
                  case "87":
                     tagMeaning = "Application Family";
                     break;
                  case "88":
                     tagMeaning = "Display Required Indicator";
                     break;
                  case "89":
                     tagMeaning = "Contactless Protocol Type State";
                     break;
                  case "8A":
                     tagMeaning = "Continuous Processing";
                     break;
                  case "8B":
                     tagMeaning = "Recognition Algorithm for Implicit Selection";
                     break;
                  case "8C":
                     tagMeaning = "Assigned Protocols for Implicit Selection";
                     break;
                  case "8D":
                     tagMeaning = "Protocol Data Type A (Card Emulation Mode)";
                     break;
                  case "8E":
                     tagMeaning = "Protocol Data Type B (Card Emulation Mode)";
                     break;
                  case "93":
                     tagMeaning = "Protocol Data Type F (Card Emulation Mode)";
                     break;
                  case "94":
                     tagMeaning = "Protocol Data Type F - System Code";
                     break;
                  case "95":
                     tagMeaning = "Communication Interface Access";
                     break;
                  default:
                     tagMeaning = "No Meaning";
                     return;
               }
               analyzeResult += TAB + tag + " " + apduData.substr(offset + 2, 2) + " " + apduData.substr(offset + 4, tagLen * 2) + " [" + tagMeaning + "] <br>";
               offset += 4 + tagLen * 2;
            }
         }
      }
      
   }
   else {
      alert("Not Supported Tag:" + tag);
      return;
   }

   $("#data_field").html(analyzeResult);
}

/* 
   CRS Set Status Command Response
   61264F05A000000001A0074F05A000000002A20B480200014F05A000000002A1074F05A000000003 
*/
function analyzeCRSSetStatusResponse(apduData) {
   var analyzeResult = "";
   var offset = 0;
   var tag = apduData.substr(offset, 2);
   var len = apduData.length;
   var fcpTagLen = 0;
   var tagLen = 0;
   var tagMeaning;

   if (tag == "61") {
      while (offset < len) {
         offset += 2;
         fcpTagLen = parseInt("0x" + apduData.substr(offset, 2));
         analyzeResult += "61" + " " +  apduData.substr(offset, 2) + " [Application related data] <br>";
         offset += 2;

         fcpTagLen = (fcpTagLen * 2 + offset);
         while (offset < fcpTagLen) {
            tagMeaning = "";
            tag = apduData.substr(offset, 2);
            tagLen = parseInt("0x" + apduData.substr(offset + 2, 2));

            switch (tag) {
               case "4F":
                  tagMeaning = "AID of the application that could not be activated due to a conflict in protocol parameters or application policy";
                  break;
               case "A0":
                  tagMeaning = "List of Conflicting Applications with conflicting protocol parameters";
                  break;
               case "A2":
                  tagMeaning = "List of reasons for application policy conflict";
                  break;
               case "A1":
                  tagMeaning = "List of applications for which the operation failed for other reasons";
                  break;
              
               default:
                  tagMeaning = "No Meaning";
                  return;
            }
            analyzeResult += TAB + tag + " " + apduData.substr(offset + 2, 2) + " " + apduData.substr(offset + 4, tagLen * 2) + " [" + tagMeaning + "] <br>";
            offset += 4 + tagLen * 2;
         }
      }
      
   }
   else {
      alert("Not Supported Tag:" + tag);
      return;
   }

   $("#data_field").html(analyzeResult);
}