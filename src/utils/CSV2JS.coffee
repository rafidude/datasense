parseCSVLine = (line) ->
  line = line.split(",")
  i = 0
  
  while i < line.length
    chunk = line[i].replace(/^[\s]*|[\s]*$/g, "")
    quote = ""
    quote = chunk.charAt(0)  if chunk.charAt(0) == "\"" or chunk.charAt(0) == "'"
    quote = ""  if quote != "" and chunk.charAt(chunk.length - 1) == quote
    unless quote == ""
      j = i + 1
      chunk = line[j].replace(/^[\s]*|[\s]*$/g, "")  if j < line.length
      while j < line.length and chunk.charAt(chunk.length - 1) != quote
        line[i] += "," + line[j]
        line.splice j, 1
        chunk = line[j].replace(/[\s]*$/g, "")
      if j < line.length
        line[i] += "," + line[j]
        line.splice j, 1
    i++
  i = 0
  
  while i < line.length
    line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "")
    if line[i].charAt(0) == "\""
      line[i] = line[i].replace(/^"|"$/g, "")
    else line[i] = line[i].replace(/^'|'$/g, "")  if line[i].charAt(0) == "'"
    i++
  line

exports.csvToJs = (csvText)->
  message = ""
  error = false
  jsonText = ""
  if csvText == ""
    error = true
    message = "CSV text must be valid."
  unless error
    csvRows = csvText.split(/[\r\n]/g)
    i = 0
    
    while i < csvRows.length
      if csvRows[i].replace(/^[\s]*|[\s]*$/g, "") == ""
        csvRows.splice i, 1
        i--
      i++
    if csvRows.length < 2
      error = true
      message = "The CSV text MUST have a header row!"
    else
      objArr = []
      i = 0
      
      while i < csvRows.length
        csvRows[i] = parseCSVLine(csvRows[i])
        i++
      i = 1
      
      while i < csvRows.length
        objArr.push {}  if csvRows[i].length > 0
        j = 0
        
        while j < csvRows[i].length
          objArr[i - 1][csvRows[0][j]] = csvRows[i][j]
          j++
        i++
  {data:objArr, error:error, message:message}