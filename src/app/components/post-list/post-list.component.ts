import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../types/post';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <h2>Lista de Tarefas </h2>
        <button class="btn-new" routerLink="/posts/new">Novo Post</button>
      </div>

      <div class="posts-grid">
        @for (post of posts; track post.id) {
          <div class="post-card">
            <h3>{{ post.title }}</h3>
            <p class="author">Autor: {{ post.author }}</p>
            <p class="message">{{ post.message }}</p>
            <div class="actions">
              <button class="btn-edit" [routerLink]="['/posts/edit', post.id]">
                Editar
              </button>
              <button class="btn-delete" (click)="deletePost(post.id)">
                Excluir
              </button>
            </div>
          </div>
        } @empty {
          <p class="no-posts">Nenhum post encontrado.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      color: #333;
      margin: 0;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .post-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .post-card:hover {
      transform: translateY(-4px);
    }

    .post-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .author {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .message {
      color: #444;
      margin: 1rem 0;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-new {
      background-color: #4CAF50;
      color: white;
    }

    .btn-new:hover {
      background-color: #45a049;
    }

    .btn-edit {
      background-color: #2196F3;
      color: white;
    }

    .btn-edit:hover {
      background-color: #1976D2;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
    }

    .btn-delete:hover {
      background-color: #d32f2f;
    }

    .no-posts {
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      color: #666;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 600px) {
      .container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .posts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})


export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  posts: Post[] = [];

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Erro ao carregar posts:', error);
      }
    });
  }

  deletePost(id: number) {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (error) => {
          console.error('Erro ao excluir post:', error);
        }
      });
    }
  }
}