import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { CandidateFormComponent } from './candidates/components/candidate-form/candidate-form.component';
import { CandidateTableComponent } from './candidates/components/candidate-table/candidate-table.component';
import { Candidate } from './candidates/models/candidate.model';
import { CandidateService } from './candidates/services/candidate.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CandidateFormComponent, CandidateTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'santander-front';

  candidates: Candidate[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @ViewChild('candidateModal') modalRef!: ElementRef;
  private bootstrapModal: any;

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates() {
    this.candidateService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading candidates: ' + (err?.error?.message || 'Unexpected error');
        console.error(err);
      }
    });
  }

  ngAfterViewInit(): void {
    const modalEl = this.modalRef.nativeElement;
    this.bootstrapModal = new bootstrap.Modal(modalEl);
  }

  handleSubmit(formData: FormData) {
    this.errorMessage = null;
    this.successMessage = null;

    this.candidateService.uploadCandidate(formData).subscribe({
      next: () => {
        this.successMessage = 'Candidate inserted successfully!';
        this.loadCandidates();
        this.bootstrapModal.hide();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unexpected error during upload.';
        console.error('Upload error:', err);
      }
    });
  }

  openModal() {
    this.bootstrapModal.show();
    this.errorMessage = null;
    this.successMessage = null;
  }
}
