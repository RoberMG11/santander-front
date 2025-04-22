import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  uploadCandidate(data: FormData): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, data);
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl)
  }
}
