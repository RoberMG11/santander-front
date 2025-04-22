import { Component, Input } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-candidate-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './candidate-table.component.html',
  styleUrl: './candidate-table.component.css'
})
export class CandidateTableComponent {
  @Input() candidates: Candidate[] = [];
  displayedColumns = ['id', 'name', 'surname', 'seniority', 'years', 'availability'];
}
