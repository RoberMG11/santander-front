import { Component } from '@angular/core';
import { CandidateFormComponent } from './candidates/components/candidate-form/candidate-form.component';
import { CandidateTableComponent } from './candidates/components/candidate-table/candidate-table.component';
import { Candidate } from './candidates/models/candidate.model';
import { CandidateService } from './candidates/services/candidate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CandidateFormComponent, CandidateTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'santander-front';

  candidates: Candidate[] = [];
  errorMessage: string | null = null;

  constructor(private candidateService: CandidateService) { }

  handleSubmit(formData: FormData) {
    this.errorMessage = null; // limpia error anterior

    this.candidateService.uploadCandidate(formData).subscribe({
      next: (candidate) => {
        this.candidates = [...this.candidates, candidate];
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unexpected error during upload.';
        console.error('Upload error:', err);
      }
    });
  }

}
