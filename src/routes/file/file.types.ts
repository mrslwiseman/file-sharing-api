export interface FileInfo {
    fileName: string;
    mimeType: string;
    encoding: string;
}

export interface FileKeys {
    publicKey: string;
    privateKey: string;
}

export interface CreateFile {
    info: FileInfo;
    keys: FileKeys;
}