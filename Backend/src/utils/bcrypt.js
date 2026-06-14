import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (
  plainPassword,
  hashedPassword
) => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};