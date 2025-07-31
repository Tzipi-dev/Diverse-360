import bcrypt from 'bcryptjs';

async function generateHash(password: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password:', hash);
}

const password = process.argv[2];
if (!password) {
  console.error('Please provide a password as argument');
  process.exit(1);
}

generateHash(password);
