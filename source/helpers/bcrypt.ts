import bcrypt from 'bcrypt';

export const generateHashedPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const compareHashedPassword = (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword);
};
