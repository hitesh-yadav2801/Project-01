const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));


app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>
    `
    res.send(html); 
})

// REST API
app.get('/api/users', (req, res) => {
    return res.json(users);
})

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id == id);
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;
        const userIndex = users.findIndex(user => user.id == id);
        console.log(userIndex)
        users[userIndex] = {
            ...users[userIndex],
            ...body,
        };
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({status: 'success'});
        })
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id == id);
        users.splice(userIndex, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({status: 'success'});
        })
    });

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id == id);
    return res.json(user);
})

app.post('/api/users', (req, res) => {
    const body = req.body
    users.push({
        id: users.length + 1,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender
    })
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status: 'success', id: users.length });
    })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
console.log('')