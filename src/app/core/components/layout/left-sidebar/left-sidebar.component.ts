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

  moveItemInArray(arr, newIndex, oldIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
  }

}
