export class FileModel {
  id_files: string;
  id_mere: string;
  file: any;
  serviceName: string;
  name: string;
  matricule: string;
  idType: string;
  valide: string;
  date: Date;
  reference: string;
  frns: string;
  montant: string;

  public constructor(init?: Partial<FileModel>) {
    Object.assign(this, init);
  }
}
