import {Component, OnInit} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  sampleList = [
    {name: 'Chillhop Music 1 ', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 2 ', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 3', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 4 ', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 5', description: 'Lorem ipsum dolor sit amet, consetetur'},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    this.sampleList = this.moveItemInArray(this.sampleList, event.previousIndex, event.currentIndex);

  }

  moveItemInArray(arr, new_index, old_index) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

}
