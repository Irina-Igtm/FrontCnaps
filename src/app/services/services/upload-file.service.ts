import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private baseUrl = 'http://localhost:8008/';

  constructor(private http: HttpClient) { }
  uploadingfile(uploadImageData) {
    this.http.post<any>(this.baseUrl + 'upload', uploadImageData, { observe: 'response' })
  }
}
