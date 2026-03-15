const fs = require('fs');
const pdfParseObj = require('pdf-parse');
console.log("Exported keys:", Object.keys(pdfParseObj));
const pdfParse = pdfParseObj.PDFParse || pdfParseObj;

const pdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\ntrailer\n<< /Size 6 /Root 1 0 R >>\n%%EOF';
fs.writeFileSync('dummy.pdf', pdfContent);
const pdfBuf = fs.readFileSync('dummy.pdf');

async function run() {
    try {
        console.log("Trying object as fn...");
        const res1 = await pdfParseObj(pdfBuf);
        console.log("Success obj:", res1.text);
    } catch(e) {
        console.log("Failed obj", e.message);
    }
    
    try {
        if (pdfParseObj.PDFParse) {
            console.log("Trying .PDFParse...");
            // maybe new PDFParse?
            const res2 = await pdfParseObj.PDFParse(pdfBuf);
            console.log("Success .PDFParse:", res2.text);
        }
    } catch(e) {
         console.log("Failed .PDFParse", e.message);
    }
}
run();
