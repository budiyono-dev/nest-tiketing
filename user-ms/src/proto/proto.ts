import { Observable } from "rxjs";

export interface TiketServiceClient {
    ping(request: Empty): Observable<Hello>;
}

export interface Hello {
    msg:string;
}

export interface Empty {

}