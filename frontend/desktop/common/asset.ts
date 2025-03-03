export interface Asset {
    ext: string;
    url: string;
}

export interface NamedAsset extends Asset {
    name: string;
}
