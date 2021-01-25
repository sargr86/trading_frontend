import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

import {VideoComponent} from '@app/user/video/video.component';

@Injectable({
    providedIn: 'root'
})
export class DoNotLeaveGuard implements CanDeactivate<VideoComponent> {

    canDeactivate(component: VideoComponent): Promise<boolean> | boolean {
        if (component.recordingState === 'started') {
            component.alertOfLeaving();
            return false;
        }
        return true;
    }
}
