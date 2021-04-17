const fse = require('fs-extra');
const srcDir = `build`;
const destDir = `../app/public`;
const fs = require('fs').promises;
const path = require('path');
                              
// To copy a folder or file  
try {
  fs.rmdir(destDir, { recursive: true })
  .then(() => {
    fse.copySync(srcDir, destDir,{ overwrite: true }, function (err) {
      if (err) {                 
        console.error(err); 
      } else {
        console.log("success!");
      }
    });
  }); 
} catch (error) {
  console.log(error);
}
