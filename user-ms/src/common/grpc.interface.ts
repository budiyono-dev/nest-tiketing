import {Observable} from 'rxjs';
export interface Empty {

}
export interface Hello {
    msg:string;
}
export interface IGrpcService {
    ping(request: Empty): Observable<Hello>;
}