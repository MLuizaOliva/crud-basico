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
        <h2>Lista de Posts</h2>
        <button class="btn-new" routerLink="/posts/new">Novo Post</button>
      </div>

      <div class="posts-grid">
        @for (post of posts; track post.id) {
          <div class="post-card">
            <h3>{{ post.title }}</h3>
            <p class="author">Autor: {{ post.author }}</p>
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
  `
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