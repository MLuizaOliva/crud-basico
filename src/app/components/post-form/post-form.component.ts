import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>{{ isEditing ? 'Editar' : 'Criar' }} Post</h2>
      
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Título:</label>
          <input id="title" type="text" formControlName="title">
        </div>

        <div class="form-group">
          <label for="author">Autor:</label>
          <input id="author" type="text" formControlName="author">
        </div>

        <div class="form-group">
          <label for="message">Mensagem:</label>
          <textarea 
            id="message" 
            formControlName="message"
            placeholder="Digite sua mensagem"
            rows="4">
          </textarea>
        </div>

        <div class="actions">
          <button 
            type="submit" 
            class="btn-primary"
            [disabled]="postForm.invalid">
            {{ isEditing ? 'Atualizar' : 'Criar' }}
          </button>
          <button 
            type="button" 
            class="btn-secondary"
            (click)="cancel()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      padding: 20px; 
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
    button[disabled] {
      background-color: #ccc;
    }
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
      font-size: 1rem;
    }
    textarea:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
  `]
})
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    message: ['', Validators.required]
  });

  isEditing = false;
  postId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.postId = +id;
      this.loadPost(this.postId);
    }
  }

  loadPost(id: number) {
    this.postService.getPost(id).subscribe(post => {
      this.postForm.patchValue(post);
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      if (this.isEditing && this.postId) {
        this.postService.updatePost(this.postId, {
          id: this.postId,
          ...this.postForm.value
        }).subscribe(() => this.router.navigate(['/posts']));
      } else {
        this.postService.createPost(this.postForm.value)
          .subscribe(() => this.router.navigate(['/posts']));
      }
    }
  }

  cancel() {
    this.router.navigate(['/posts']);
  }
}