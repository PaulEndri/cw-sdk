import dotenv from 'dotenv';

const env = dotenv.config();

export default Object.assign({}, process.env, env.parsed);