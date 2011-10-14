(function() {
  var parseCSVLine;
  parseCSVLine = function(line) {
    var chunk, i, j, quote;
    line = line.split(",");
    i = 0;
    while (i < line.length) {
      chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
      quote = "";
      if (chunk.charAt(0) === "\"" || chunk.charAt(0) === "'") {
        quote = chunk.charAt(0);
      }
      if (quote !== "" && chunk.charAt(chunk.length - 1) === quote) {
        quote = "";
      }
      if (quote !== "") {
        j = i + 1;
        if (j < line.length) {
          chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
        }
        while (j < line.length && chunk.charAt(chunk.length - 1) !== quote) {
          line[i] += "," + line[j];
          line.splice(j, 1);
          chunk = line[j].replace(/[\s]*$/g, "");
        }
        if (j < line.length) {
          line[i] += "," + line[j];
          line.splice(j, 1);
        }
      }
      i++;
    }
    i = 0;
    while (i < line.length) {
      line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
      if (line[i].charAt(0) === "\"") {
        line[i] = line[i].replace(/^"|"$/g, "");
      } else {
        if (line[i].charAt(0) === "'") {
          line[i] = line[i].replace(/^'|'$/g, "");
        }
      }
      i++;
    }
    return line;
  };
  exports.csvToJs = function(csvText) {
    var csvRows, error, i, j, jsonText, message, objArr;
    message = "";
    error = false;
    jsonText = "";
    if (csvText === "") {
      error = true;
      message = "CSV text must be valid.";
    }
    if (!error) {
      csvRows = csvText.split(/[\r\n]/g);
      i = 0;
      while (i < csvRows.length) {
        if (csvRows[i].replace(/^[\s]*|[\s]*$/g, "") === "") {
          csvRows.splice(i, 1);
          i--;
        }
        i++;
      }
      if (csvRows.length < 2) {
        error = true;
        message = "The CSV text MUST have a header row!";
      } else {
        objArr = [];
        i = 0;
        while (i < csvRows.length) {
          csvRows[i] = parseCSVLine(csvRows[i]);
          i++;
        }
        i = 1;
        while (i < csvRows.length) {
          if (csvRows[i].length > 0) {
            objArr.push({});
          }
          j = 0;
          while (j < csvRows[i].length) {
            objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
            j++;
          }
          i++;
        }
      }
    }
    return {
      data: objArr,
      error: error,
      message: message
    };
  };
}).call(this);
