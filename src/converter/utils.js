class Utils {
  static getRowsNumber(sheet) {
    const keys = Object.keys(sheet);
    return Number(keys[keys.length -3].slice(1));
  }

  static getMappedDataArray(sheet, mapperFunction) {
    const rows = this.getRowsNumber(sheet);
    const data = [];
    for (let i = 1; i < rows; i += 1) {
      data.push(mapperFunction(sheet, i));
    }
    return data;
  }

  static isEmpty(obj) {
    for (var x in obj) { if (obj.hasOwnProperty(x))  return false; }
    return true;
 }

 static cutLink(link) {
    const ln = link.split('/');
    return ln[ln.length - 1].toLowerCase();
 }
}

module.exports = Utils;
