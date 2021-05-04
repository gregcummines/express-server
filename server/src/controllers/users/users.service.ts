import * as jwt from 'jsonwebtoken';
import { WalrusDatabase } from 'respository/walrus';
import User from '../../interfaces/user.interface';
export class UsersService {
    // users hardcoded for simplicity, store in a db for production applications
    public authenticate({ username, password }) {
        const walrusDatabase = new WalrusDatabase();
        const user = walrusDatabase.getUser(username, password);

        if (!user) throw 'Username or password is incorrect';

        // create a jwt token that is valid for 7 days
        const token = jwt.sign({ id: user.id }, process.env["WALRUS_JWT_SECRET_KEY"], { expiresIn: '30d' });
        console.log(`Returning auth token: ${token}`);
        return {
            ...user,
            token
        };
    }

    public getAll(): User[] {
        const walrusDatabase = new WalrusDatabase();
        return walrusDatabase.getUsers();
    }
}