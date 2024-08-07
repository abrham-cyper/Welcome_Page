
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = async function(event) {
        const uint8Array = new Uint8Array(event.target.result);
        const path = "your/file/path.txt"; // Replace with desired path
        const response = await BeeStorage().upload({ file: uint8Array, path });
        
        if (response) {
          console.log('Upload successful:', response);
        } else {
          console.log('Upload failed');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.log('No file selected');
    }
  }