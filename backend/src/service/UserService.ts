import { hash, compare } from 'bcryptjs';
import UserRepository from '../repository/UserRepository';

class UserService {
    async login(username: string, password: string) {

        const user = await UserRepository.findByUsername(username);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new Error('Senha incorreta');
        }

        return { username: user.username, role: user.role };
}

    async create(username: string, password: string, role: string) {
        try {

            const passwordHash = await hash(password, 10);

            const user = {
                username,
                password: passwordHash,
                role
            };

            const newUser = await UserRepository.create(user);

            return newUser;

        } catch (e) {
            console.log(e);
            throw new Error('Erro ao criar usuário');
        }
    }
}

export default new UserService();