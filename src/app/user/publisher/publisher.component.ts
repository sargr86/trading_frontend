import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OpentokService} from '@core/services/opentok.service';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit, AfterViewInit {

  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publisher: OT.Publisher;
  publishing: boolean;
  screenSharing = false;
  screenSharePublisher;

  constructor(private opentokService: OpentokService) {
    this.publishing = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {insertMode: 'append'});
    if (this.session) {
      // if (this.session['isConnected']()) {
      //   this.publish();
      // }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  shareScreen() {


    OT.checkScreenSharingCapability(response => {
      if (!response.supported || response.extensionRegistered === false) {
        alert('Screen sharing not supported');
      } else if (response.extensionInstalled === false) {
        alert('Browser requires extension');
      } else {
        this.screenSharePublisher = OT.initPublisher(
          'screen',
          {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            videoSource: 'screen',
            publishAudio: true
          },
          this.handleCallback
        );
        this.screenSharing = true;
        this.session.publish(this.screenSharePublisher, this.handleCallback);
      }
    });
  }

  stopScreenSharing() {
    this.screenSharePublisher.destroy();
    this.screenSharing = false;
  }

  handleCallback(error) {
    if (error) {
      console.log('error: ' + error.message);
    }
  }

}
