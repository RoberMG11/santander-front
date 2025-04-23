import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CandidateService } from './candidates/services/candidate.service';
import { of, throwError } from 'rxjs';
import { Candidate } from './candidates/models/candidate.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let candidateServiceMock: jasmine.SpyObj<CandidateService>;

  beforeEach(async () => {
    candidateServiceMock = jasmine.createSpyObj('CandidateService', ['getCandidates', 'uploadCandidate']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: CandidateService, useValue: candidateServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const mockCandidates: Candidate[] = [
      { id: 1, name: 'Juan', surname: 'Carrera', seniority: 'junior', yearsOfExperience: 2, availability: true },
      { id: 2, name: 'Javi', surname: 'Fuego', seniority: 'senior', yearsOfExperience: 5, availability: false }
    ];
    candidateServiceMock.getCandidates.and.returnValue(of(mockCandidates));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidates on ngOnInit', () => {
    component.ngOnInit();

    expect(candidateServiceMock.getCandidates).toHaveBeenCalled();
  });

  it('should handle error when loading candidates', () => {
    const errorResponse = { error: { message: 'Error loading data' } };
    candidateServiceMock.getCandidates.and.returnValue(throwError(() => new Error('Error loading data')));

    component.ngOnInit();

    expect(component.errorMessage).not.toBe('');
  });

  it('should handle successful candidate upload', () => {
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

    candidateServiceMock.uploadCandidate.and.returnValue(of(mockCandidate));

    component.handleSubmit(formData);

    expect(candidateServiceMock.uploadCandidate).toHaveBeenCalledWith(formData);
    expect(component.successMessage).toBe('Candidate inserted successfully!');
  });

  it('should handle error during candidate upload', () => {
    const formData = new FormData();
    formData.append('name', 'Carlos');
    formData.append('surname', 'Tevez');
    formData.append('seniority', 'junior');
    formData.append('yearsOfExperience', '3');
    formData.append('availability', 'true');

    candidateServiceMock.uploadCandidate.and.returnValue(throwError(() => new Error('Upload failed')));

    component.handleSubmit(formData);

    expect(component.errorMessage).not.toBe('');
  });

  it('should open modal and reset messages', () => {
    const modalSpy = spyOn(component['bootstrapModal'], 'show');
    component.openModal();

    expect(modalSpy).toHaveBeenCalled();
    expect(component.errorMessage).toBeNull();
    expect(component.successMessage).toBeNull();
  });
});
