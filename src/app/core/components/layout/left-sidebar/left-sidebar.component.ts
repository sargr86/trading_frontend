import {Component, OnInit} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';

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
    {name: 'Chillhop Music 6', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 7', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 8', description: 'Lorem ipsum dolor sit amet, consetetur'},
    {name: 'Chillhop Music 9', description: 'Lorem ipsum dolor sit amet, consetetur'},
  ];

  constructor(
    public router: Router
  ) {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    this.sampleList = this.moveItemInArray(this.sampleList, event.previousIndex, event.currentIndex);
  }

  moveItemInArray(arr, from, to) {
    const f = arr.splice(from, 1)[0];
    arr.splice(to, 0, f);
    return arr;
  }

}
