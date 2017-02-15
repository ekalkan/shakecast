import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Router } from '@angular/router';

import { MapService } from '../../../shared/maps/map.service'
import { NotificationService } from '../dashboard/notification-dash/notification.service.ts'
import { FacilityService } from '../../../shakecast-admin/pages/facilities/facility.service.ts'

export interface Earthquake {
    shakecast_id: string;
    event_id: string;
    magnitude: number;
    depth: number;
    lat: number;
    lon: number;
    description: string;
    shakemaps: number;
}

@Injectable()
export class EarthquakeService {
    public earthquakeData = new ReplaySubject(1);
    public dataLoading = new ReplaySubject(1);
    public plotting = new ReplaySubject(1);
    public filter = {};
    public configs: any = {clearOnPlot: 'all'};

    constructor(private _http: Http,
                private notService: NotificationService,
                private mapService: MapService,
                private facService: FacilityService,
                private _router: Router) {}

    getData(filter: any = {}) {
        this.dataLoading.next(true);
        let params = new URLSearchParams();
        params.set('filter', JSON.stringify(filter))
        this._http.get('/api/earthquake-data', {search: params})
            .map((result: Response) => result.json())
            .subscribe((result: any) => {
                this.earthquakeData.next(result.data);
                this.dataLoading.next(false);
            })
    }

    getFacilityData(facility: any) {
        this.dataLoading.next(true);
        this._http.get('/api/earthquake-data/facility/' + facility['shakecast_id'])
            .map((result: Response) => result.json())
            .subscribe((result: any) => {
                this.earthquakeData.next(result.data);
                this.dataLoading.next(false);
            })
    }
    
    plotEq(eq: Earthquake) {
        this.notService.getNotifications(eq);
        this.plotting.next(eq);

        if (this._router.url == '/shakecast/dashboard') {
            this.facService.getShakeMapData(eq);
        }

        this.mapService.plotEq(eq, this.configs['clearOnPlot']);
    }
}