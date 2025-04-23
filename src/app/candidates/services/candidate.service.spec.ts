import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidateService } from './candidate.service';
import { Candidate } from '../models/candidate.model';
import { environment } from '../../../environment'; 

describe('CandidateService', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CandidateService]
    });
    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCandidates', () => {
    it('should return a list of candidates', () => {
      const mockCandidates: Candidate[] = [
        { id: 1, name: 'Juan', surname: 'Carrera', seniority: 'junior', yearsOfExperience: 2, availability: true },
        { id: 2, name: 'Javi', surname: 'Fuego', seniority: 'senior', yearsOfExperience: 5, availability: false }
      ];

      service.getCandidates().subscribe(candidates => {
        expect(candidates.length).toBe(2);
        expect(candidates).toEqual(mockCandidates);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCandidates);
    });

    it('should handle error while fetching candidates', () => {
      const errorMessage = 'Error loading candidates';

      service.getCandidates().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('uploadCandidate', () => {
    it('should successfully upload a candidate', () => {
      const formData = new FormData();
      formData.append('name', 'Carlos');
      formData.append('surname', 'Tevez');
      formData.append('seniority', 'junior');
      formData.append('yearsOfExperience', '3');
      formData.append('availability', 'true');

      const mockCandidate: Candidate = {
        id: 3,
        name: 'Carlos',
        surname: 'Tevez',
        seniority: 'junior',
        yearsOfExperience: 3,
        availability: true
      };

      service.uploadCandidate(formData).subscribe(candidate => {
        expect(candidate).toEqual(mockCandidate);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);
      req.flush(mockCandidate);
    });

    it('should handle error during candidate upload', () => {
      const formData = new FormData();
      formData.append('name', 'Carlos');
      formData.append('surname', 'Tevez');
      formData.append('seniority', 'junior');
      formData.append('yearsOfExperience', '3');
      formData.append('availability', 'true');

      const errorMessage = 'Upload failed';

      service.uploadCandidate(formData).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates`);
      expect(req.request.method).toBe('POST');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
