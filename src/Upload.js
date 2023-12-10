import React, { useState, useEffect } from 'react';
import './App.css';
import { FileUploader } from "react-drag-drop-files";
import { PDFDocument } from 'pdf-lib';
import dd from './aa.jpg';
import aa from './signature.png';

const PNGTypes = ["PNG"];
const PDFTypes = ["PDF"];

const App = () => {
  const [Pdf, setPdf] = useState(null);

  const [showNext, setShowNext] = useState(false);
  const [data, setData] = useState(null); // State to hold the data

  const [pdfBytes, setPdfBytes] = useState(null);
  const [position, setPosition] = useState({
    x: 120,
    y: 100,
    width: 600,
    height: 300,
  });



  useEffect(() => {
  
   
  }, [position]);

  const handleFileChange = async (event) => {
    const someData = 'data';
    setData(someData);
    const file = Pdf[0];
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

  const handleChange1 = (PDF) => {
    setPdf(PDF);
  };



  useEffect(() => {
    // Check if both Pdf and Signature are uploaded to show the Next button
    if (Pdf) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  }, [Pdf]);

  const handleNext = () => {
    // Assuming you have some logic to determine the data value
    // For example, assigning a sample value 'kooooooooo'
  
  };

  return (
    <div>
      <div className='menuBar'></div>
      <div className="App">
        <h1>Upload PDF</h1>
        <div className="label">
          <FileUploader
            multiple={true}
            handleChange={handleChange1}
            name="file1"
            types={PDFTypes}
          />
        </div>
        <p>{Pdf ? `PDF Name: ${Pdf[0].name}` : "No PDF Uploaded !"}</p>

        {showNext && (
            <div className='padding'>
          <button  className='button' onClick={handleFileChange}>Next</button>


            </div>
        )}

        {data &&
        
        <div>
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
          <div className='padding'>
          <button className="button" onClick={downloadPdf}>Download Modified PDF</button>

            </div>
          <iframe src={pdfSrc} title="Modified PDF" width="800" height="800" />
        </div>
      )}
    </div>
        }
      </div>
    </div>
  );
};

export default App;
