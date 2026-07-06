import { User } from "../models";
import { UserAttributes } from "../Types/type";

class UserRepository {

    async findByUsername(username: string) {
        try {
            const user = await User.findOne({ where: { username } });
            return user?.dataValues;
        } catch (e) {
            console.log(e)
            throw new Error('Erro ao buscar usuário');
        }
    }

    async create(user: UserAttributes) {
        try {
            const newUser = await User.create(user as any);
            return newUser;
        } catch (e) {
            console.log(e)
            throw new Error('Erro ao criar usuário');
        }
    }
}

export default new UserRepository();