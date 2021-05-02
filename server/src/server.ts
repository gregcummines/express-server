import App from './app';
import PostsController from './controllers/posts/posts.controller';
import { UsersController } from './controllers/users/users.controller';
 
const app = new App(
  [
    new PostsController(),
    new UsersController(),
  ],
  3001,
);
 
app.listen();