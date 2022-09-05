const apiRouter = require('express') .Router()
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const util = require('util')
const readFile = util.promisify(fs.readFile)

function getNotes() {
    return readFile('db/db.json', 'utf-8').then(origNotes => {
      let parsedNotes = [].concat(JSON.parse(origNotes))
      return parsedNotes;
    })
  }

  apiRouter.get('/api/notes', (req, res) => {
    getNotes().then(data => res.json(data))
  })
  
  apiRouter.post('/api/notes', (req, res) => {
    console.info(`Received ${req.method} request`)
    const { title, text } = req.body;
    const addNote = {
      title,
      text,
      id: uuidv4(),
    };
  
    getNotes().then(oldNotes => {
      let newNotes = [...oldNotes, addNote]
      fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 4), (err) => {
        res.json({msg:"ok"});
        console.log(`Note added!`)
      })
    })
  });

apiRouter.delete('/api/notes/:id', (req, res) => {
    getNotes().then(oldNotes => {
        let filteredNotes = oldNotes.filter(note => note.id !== req.params.id)
        console.log(filteredNotes)
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (err) => {
            res.json({msg:"ok"});
          })
    })
});

  module.exports = apiRouter