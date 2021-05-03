import * as jwt from 'jsonwebtoken';

export class UsersService {
    // users hardcoded for simplicity, store in a db for production applications
    private users: any = [{ id: 1, username: 'test@gmail.com', password: 'test', firstName: 'Test', lastName: 'User' }];
    
    public async authenticate({ username, password }) {
        const user = this.users.find(u => u.username === username && u.password === password);

        if (!user) throw 'Username or password is incorrect';

        // create a jwt token that is valid for 7 days
        const token = jwt.sign({ id: user.id }, process.env["WALRUS_JWT_SECRET_KEY"], { expiresIn: '30d' });
        console.log(`Returning auth token: ${token}`);
        return {
            ...this.omitPassword(user),
            token
        };
    }

    public async getAll() {
        return this.users.map(u => this.omitPassword(u));
    }

    omitPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}