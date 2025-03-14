import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../types/post';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Posts</h2>
      <button (click)="navigateToCreate()">Novo Post</button>

      <div class="posts-grid">
        @for (post of posts; track post.id) {
          <div class="post-card">
            <h3>{{ post.title }}</h3>
            <p>{{ post.author }}</p>
            <div class="actions">
              <button (click)="editPost(post.id)">Editar</button>
              <button (click)="deletePost(post.id)">Excluir</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .post-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
    button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
  `]
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  posts: Post[] = [];

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  navigateToCreate() {
    this.router.navigate(['/posts/new']);
  }

  editPost(id: number) {
    this.router.navigate(['/posts/edit', id]);
  }

  deletePost(id: number) {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      this.postService.deletePost(id).subscribe(() => {
        this.loadPosts();
      });
    }
  }
}