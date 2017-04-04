/** 
* Loader that takes the source file, reads its name and if 
* a LESS file exist with the same name, inject a line that imports
* the LESS file. Eg. if file is xyz.jsx and xyz.less exists in the
* same directory as xyz.jsx, the loader will inject the line 
* import ./xyz.less in xyz.jsx. 
* 
* Takes the following query object:
*   ignoreNodeModules : will not alter anything that is in node_modules if true
**/

const fs = require('fs');

module.exports = function(source) {
  if (this.resourcePath.includes("node_modules") 
      && (this.query.ignoreNodeModules === undefined ? true : this.query.ignoreNodeModules))
    return source;
  else {
    const fileName = this.resourcePath.match(/\/([a-zA-Z0-9]+)\./)[1] + '.less';
    const importStatement = 'import \'./' + fileName + '\';' + '\n';
    
    try {
      fs.statSync(this.context + '/' + fileName);
      return importStatement + source;
    } catch (err) {
      if (err.code == 'ENOENT')
        return source
      throw err;
    }
    
  }
}