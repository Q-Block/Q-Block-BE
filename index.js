import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './srcs/auth/auth.route.js';
import userRoutes from './srcs/user/user.route.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

// API 엔드포인트 설정
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
