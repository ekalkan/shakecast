import { Component,
         OnInit,
         OnDestroy,
         AfterViewInit } from '@angular/core';

import { EarthquakeService } from '../earthquakes/earthquake.service'
import { FacilityService } from '../../../shakecast-admin/pages/facilities/facility.service'
import { TitleService } from '../../../title/title.service';

import { TimerObservable } from "rxjs/observable/TimerObservable";
import { showLeft, showRight, showBottom } from '../../../shared/animations/animations';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css',
                  '../../../shared/css/panels.css'],
    animations: [ showLeft, showRight, showBottom ]
})
export class DashboardComponent implements OnInit, OnDestroy {
    public facilityData: any = [];
    public earthquakeData: any = [];
    private subscriptions: any[] = [];

    public showBottom: string = 'shown';
    public showLeft: string = 'hidden';
    public showRight: string = 'shown';

    constructor(private eqService: EarthquakeService,
                private facService: FacilityService,
                private titleService: TitleService) {}
  
    ngOnInit() {
        this.titleService.title.next('Dashboard')
        if (this.facService.sub) {
            this.facService.sub.unsubscribe();
        }
        
        this.subscriptions.push(this.facService.facilityData.subscribe(facs => {
            this.facilityData = facs;
        }));

        this.subscriptions.push(this.eqService.earthquakeData.subscribe((eqs: any[]) => {
            this.earthquakeData = eqs;
            if (eqs.length > 0) {
                this.eqService.plotEq(eqs[0])
                this.showRight = 'shown'
            } else {
                this.eqService.clearData();
            }
        }));

        this.subscriptions.push(TimerObservable.create(0, 60000)
            .subscribe((x: any) => {
                this.eqService.getData(this.eqService.filter);
            }));

        this.eqService.filter['timeframe'] = 'day'
        this.eqService.filter['shakemap'] = true
        this.eqService.filter['scenario'] = false
        this.eqService.getData(this.eqService.filter);
    }

    toggleLeft() {
        if (this.showLeft == 'hidden') {
            this.showLeft = 'shown';
        } else {
            this.showLeft = 'hidden'
        }
    }

    toggleRight() {
        if (this.showRight == 'hidden') {
            this.showRight = 'shown';
        } else {
            this.showRight = 'hidden'
        }
    }

    toggleBottom() {
        if (this.showBottom == 'hidden') {
            this.showBottom = 'shown';
        } else {
            this.showBottom = 'hidden'
        }
    }
  
    ngOnDestroy() {
        this.eqService.earthquakeData.next([]);
        this.eqService.clearData();
        this.endSubscriptions()
    }

    endSubscriptions() {
        for (var sub in this.subscriptions) {
            this.subscriptions[sub].unsubscribe()
        }
    }
}