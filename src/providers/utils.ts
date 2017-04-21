
export class Utils {

  static titleToID(title: String): string {
    return title.replace(/ +/g, "_").toLocaleLowerCase();
  }

  static uriToFileName(uri: string): string {
    return uri.replace(/^.*[\\\/]/, '');
  }

  static uriToFolderName(uri: string): string {
    return uri.match(/([^\/]*)\/*$/)[1];
  }

  static uriToParentPath(uri: string): string {
    return uri.match(/(.*)[\/\\]/)[1]||'';
  }

  static dataURItoBlob(dataURI, dataTYPE): Blob {
    let binary = atob(dataURI.split(',')[1]), array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: dataTYPE});
  }

}
