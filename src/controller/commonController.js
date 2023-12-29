const { log } = require('console');
const fs = require('fs');
const PDFParser = require('pdf2json');
module.exports.getDataFromPDF =async (req,res)=>{
    try {
        
  
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }else{
        let pdfFilePath = req.file.path;
    function extractTables(pdfPath) {
  const pdfParser = new PDFParser();

  pdfParser.loadPDF(pdfPath);

  pdfParser.on('pdfParser_dataReady', pdfData => {
    const tables = findTables(pdfData);

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const numRows = table.length;
      const numCols = numRows > 0 ? table[0].length : 0;

    //  console.log(`Table ${i + 1}: ${numRows} rows, ${numCols} columns`);
    }
    //console.log('Identified Tables:', tables);
    const jsonArray = convertTableToJson(tables);
//console.log(JSON.stringify(jsonArray, null, 2));
res.send(JSON.stringify(jsonArray, null, 2))
  });

  pdfParser.on('pdfParser_dataError', errData =>
    console.error('Error while parsing PDF:', errData.parserError)
  );
}

function findTables(pdfData) {
  const tables = [];

  // Iterate through pages
  pdfData.Pages.forEach(page => {
    const pageTables = findTablesInPage(page);
    tables.push(...pageTables);
  });

  return tables;
}

function findTablesInPage(page) {
  const tables = [];
  const lines = page.Texts;

  // Your logic to identify tables based on the lines goes here
  // You may need to analyze the positions of text elements to identify rows and columns

  // For simplicity, let's assume a simple logic to identify tables: every 3 consecutive lines form a table row
  for (let i = 0; i < lines.length; i += 4) {
    const row = lines.slice(i, i + 4).map(text => text.R[0].T);
    tables.push(row);
  }

  return tables;
}

// Replace 'your-pdf-file.pdf' with the path to your PDF file
const pdfPath = pdfFilePath;
extractTables(pdfPath);

function convertTableToJson(table) {
  console.log(table)
  const headers = table[4].map(header => header.replace(/%20/g, ' ')); // Replace '%20' with space
  const rows = table.slice(5); // Exclude the first row (headers)

  const jsonArray = [];

  for (const row of rows) {
    const jsonObject = {};
    row.forEach((cell, index) => {
      const decodedCell = decodeURIComponent(cell);
      const cellValue = decodedCell.replace(/%20/g, ' '); // Replace %20 with a space
      jsonObject[headers[index]] = cellValue;
    });
    jsonArray.push(jsonObject);
  }

  
  return jsonArray;
}

// Example usage:
// const table = [
//   ['Lot%20%23', 'Size%20Range', 'Lot%20Name', '%23%20Stns'],
//   ['CVP-1150-001', '5-7OT', 'Z%20MB%20Lullow%20YELLOW', '3'],
//   // ... other rows ...
// ];

// const jsonArray = convertTableToJson(table);
// console.log(JSON.stringify(jsonArray, null, 2)); // Pretty-print JSON

}   } catch (error) {
        console.log(error);
    }
}