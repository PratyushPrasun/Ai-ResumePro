const fs = require('fs');
const pdfParseObj = require('pdf-parse');

const pdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\ntrailer\n<< /Size 6 /Root 1 0 R >>\n%%EOF';
fs.writeFileSync('dummy.pdf', pdfContent);
const pdfBuf = fs.readFileSync('dummy.pdf');

async function run() {
    try {
        if (pdfParseObj.PDFParse) {
            console.log("Instantiating .PDFParse...");
            const parser = new pdfParseObj.PDFParse();
            // Let's guess the API: parse, extract, execute, run?
            console.log(Object.keys(parser));
            console.log(typeof parser.parse, typeof parser.extract);
        }
    } catch(e) {
         console.log("Failed", e.message);
    }
}
run();
