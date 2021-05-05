import * as jwt from 'jsonwebtoken';
import { WalrusDatabase } from '../../repository/walrus';
import { User } from '../../interfaces/user';
import * as bcrypt from 'bcrypt';
import { Role } from '../../interfaces/role';
export class UsersService {
    private readonly salt = 5;

    public authenticate({ username, password }): User {
        const walrusDatabase = new WalrusDatabase();
        const user = walrusDatabase.getUser(username);
        // If the user is not found or the password is incorrect
        if (!user ||
            !bcrypt.compareSync(user.password, password) ) {
                throw 'Username or password is incorrect';
        }
        
        // If the user is active, create an auth token
        if (user.active) {
            // create a jwt token that is valid for 7 days
            const token = jwt.sign({ id: user.id }, process.env["WALRUS_JWT_SECRET_KEY"], { expiresIn: '30d' });
            user.token = token;
        }
        return user;
    }

    public register({ firstName, lastName, email, password }): User {
        const walrusDatabase = new WalrusDatabase();
        const passwordHash = bcrypt.hashSync(password, this.salt);
        const user = walrusDatabase.addUser(
                firstName, 
                lastName, 
                email, 
                passwordHash
            );

        if (user.role === Role.Admin) {
            const token = jwt.sign({ id: user.id }, process.env["WALRUS_JWT_SECRET_KEY"], { expiresIn: '30d' });
            user.token = token;
        }
        return user;
    }

    public getAll(): User[] {
        const walrusDatabase = new WalrusDatabase();
        return walrusDatabase.getUsers();
    }
}