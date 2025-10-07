import express from 'express'; 
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());    

app.get('/teste', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

