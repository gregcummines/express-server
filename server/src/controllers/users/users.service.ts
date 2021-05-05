import * as jwt from 'jsonwebtoken';
import { WalrusRepository } from '../../repository/walrus';
import { User } from '../../interfaces/user';
import * as bcrypt from 'bcrypt';
import { Role } from '../../interfaces/role';
export class UsersService {

    public authenticate({ username, password }): User {
        const walrusRepository = new WalrusRepository();
        const user = walrusRepository.getUser(username);
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
        const walrusRepository = new WalrusRepository();
        const passwordHash = bcrypt.hashSync(password, process.env["WALRUS_PASSWORD_SALT"]);
        const user = walrusRepository.addUser(
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
        const walrusRepository = new WalrusRepository();
        return walrusRepository.getUsers();
    }
}