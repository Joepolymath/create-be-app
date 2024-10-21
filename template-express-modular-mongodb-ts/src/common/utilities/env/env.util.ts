import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
      devDefault: 'development',
      default: 'development',
    }),
    DB_URI: str({ default: 'mongodb://127.0.0.1:27017/rapidmedicare' }),
    PORT: port({ default: 8000 }),
    JWT_SECRET: str(),
    BCRYPT_SALT: str(),
    SEND_CHAMP_API_KEY: str(),
    SEND_CHAMP_URL: str(),
  });
}

export default validateEnv;
