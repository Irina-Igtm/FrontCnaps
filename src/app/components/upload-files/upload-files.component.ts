import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFileService } from 'app/services/services/upload-file.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  accessToken:any
  idToken:any
  constructor(private uploadService: UploadFileService,
    private toastr: ToastrService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;       
  }
  //Gets called when the user selects an image
  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
  }

 //Gets called when the user clicks on submit to upload the image
 onUpload() {
  console.log(this.selectedFile);
  
  //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
  const uploadImageData = new FormData();
  uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

  let headers = new HttpHeaders({ "Authorization": "Bearer " + this.idToken });
  //Make a call to the Spring Boot Application to save the image
  this.http.post('http://localhost:8008/upload', uploadImageData, { headers: headers ,observe: 'response' })
    .subscribe((response) => {
      console.log("data" , response.status);   
      if (response.status == 200) {
        this.message = 'Image uploaded successfully';
        this.toastr.success(this.message)
      } else {
        this.message = 'Image not uploaded successfully';
        this.toastr.error(this.message)
      }
    });
}

getImage() {
  let headers = new HttpHeaders({ "Authorization": "Bearer " + this.idToken });

  //Make a call to Sprinf Boot to get the Image Bytes.
  this.http.get('http://localhost:8008/get?imageName' + this.imageName , { headers: headers })
    .subscribe(
      res => {
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    );
}

 
}
