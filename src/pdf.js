import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import dd from './aa.jpg';
import aa from './signature.png';

const PdfEditor = ({name}) => {

  console.log("aaaaaaa",name)
  const [pdfBytes, setPdfBytes] = useState(null);
  const [position, setPosition] = useState({
    x: 75,
    y: 0,
    width: 0,
    height: 0,
  });


  useEffect(() => {
  
   
  }, [position]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const existingPdfBytes = new Uint8Array(e.target.result);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const page = pdfDoc.addPage();

      const jpgImageBytes = await fetch(dd).then((res) => res.arrayBuffer());
      const pngImageBytes = await fetch(aa).then((res) => res.arrayBuffer());

      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      const pngImage = await pdfDoc.embedPng(pngImageBytes);

      const pngDims = pngImage.scale(0.5);

      // Update positioning and dimensions based on state
      const modifiedPosition = {
        x: page.getWidth() / 20 - pngDims.width / 2 + position.x,
        y: page.getHeight() / 2 - pngDims.height + position.y,
        width: position.width !== 0 ? position.width : pngDims.width,
        height: position.height !== 0 ? position.height : pngDims.height,
      };

      firstPage.drawImage(pngImage, modifiedPosition);

      const modifiedPdfBytes = await pdfDoc.save();
      setPdfBytes(modifiedPdfBytes);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (event) => {
    setPosition({
      ...position,
      [event.target.name]: parseInt(event.target.value, 10),
    });
  };

  const downloadPdf = () => {
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified_pdf.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const pdfSrc = pdfBytes
    ? URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
    : '';

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {pdfBytes && (
        <div>
          <label>
            X-coordinate:
            <input type="number" name="x" value={position.x} onChange={handleInputChange} />
          </label>
          <label>
            Y-coordinate:
            <input type="number" name="y" value={position.y} onChange={handleInputChange} />
          </label>
          <label>
            Width:
            <input type="number" name="width" value={position.width} onChange={handleInputChange} />
          </label>
          <label>
            Height:
            <input type="number" name="height" value={position.height} onChange={handleInputChange} />
          </label>
          <button onClick={downloadPdf}>Download Modified PDF</button>
          <iframe src={pdfSrc} title="Modified PDF" width="800" height="800" />
        </div>
      )}
    </div>
  );
};

export default PdfEditor;

