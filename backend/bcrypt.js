import bcrypt from 'bcrypt';

const saltRounds = 10;
const plainPassword = 'password123';

const hash = await bcrypt.hash(plainPassword, saltRounds);

console.log('hash password;', hash);
