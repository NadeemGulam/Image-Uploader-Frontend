import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  file?: File;
  uploaded_view?: string;

  listOfImages: any;
  messageStatus: boolean = false;
  uploading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getInitialData();
  }

  getInitialData() {
    this.http.get("http://localhost:8080/api/v1/s3").subscribe((e) => {
      this.listOfImages = e;
      console.log(this.listOfImages);
    },
      (error) => {
        console.error('Upload failed', error);
      }
    );
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      if (this.file?.type == "image/jpeg" || this.file?.type == "image/png") {
        console.log(this.file);
      }
      else {
        alert("Select an Image file only");
        this.file = undefined;
      }
    }
  }

  formSubmit(event: Event) {
    event.preventDefault();
    if (this.file) {
      // Image upload
      this.uploadImageToServer();
    } else {
      alert("Select an Image file only");
    }
  }

  uploadImageToServer() {
    if (this.file) {
      this.uploading = true
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);

      this.http.post("http://localhost:8080/api/v1/s3", formData, { responseType: 'text' }).subscribe(
        (response: string) => {
          this.uploaded_view = response
          console.log('Upload successful', response);
          this.uploading = false;
          this.messageStatus = true;// Expecting a URL or plain text
          this.listOfImages.unshift(response)
        },
        (error) => {
          console.error('Upload failed', error);
          this.uploading = false;
        }
      );
    }

  }
}
