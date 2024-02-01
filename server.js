const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/data', (_, res) => {
    const data = [
        {
            id: 1,
            label: 'Room Temperature',
            value: '36',
            suffix: 'f',
        },
        {
            id: 2,
            label: 'Electricity Usage',
            value: '2700',
            suffix: 'kWh',
        },
        {
            id: 3,
            label: 'Water Usage',
            value: '156',
            suffix: 'm3',
        },
        {
            id: 4,
            label: 'Gas Usage',
            value: '11500',
            suffix: 'kWh',
        },
    ];
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
