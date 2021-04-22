const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const {isAuthenticated}=require('../helpers/auth');


router.get('/notes/add',isAuthenticated, (req, res) => {
    res.render('notes/new-note');

});

router.post('/notes/new-note',isAuthenticated, async (req, res) => {
    const {
        title,
        description
    } = req.body;
    const errors = [];
    if (!title) {
        errors.push({
            text: 'escriba un titulo'
        });
    }
    if (!description) {
        errors.push({
            text: 'porfavor escriba una descripcion'
        });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {

        const newNote = new Note({
            title,
            description
        });
        //enlazar id con la nota
        newNote.user=req.user.id;
        await newNote.save();
        req.flash('success_msg','Nota agregada');
        console.log(newNote);
        res.redirect('/notes');

    }
});
router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user:req.user.id}).sort({date:'desc'})
        .then(documentos => {
            const contexto = {
                notes: documentos.map(documento => {
                    return {
                        title: documento.title,
                        description: documento.description,
                        _id:documento._id
                    }
                })
            }
            res.render('notes/all-notes', {
                notes: contexto.notes
            })
        })
})

router.get('/notes/edit/:id',isAuthenticated, async (req, res) => {
    console.log(req.params.id)
    const notes = await Note.findById(req.params.id).lean()
    
    .then(data =>{
        return {
            title:data.title,
            description:data.description,
            _id:data._id
        }
    })
    res.render('notes/edit-note',{notes})
});

//actuazliar
router.put('/notes/edit-note/:id',isAuthenticated, async (req, res) =>{
    const {title,description} = req.body;
     await Note.findByIdAndUpdate(req.params.id,{title, description});
     req.flash('success_msg','nota actualizada')
     res.redirect(('/notes'))
});


router.delete('/notes/delete/:id',isAuthenticated,async (req, res) => {
    console.log(req.params.id)
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','nota eliminada satisfactoriamente')

     res.redirect('/notes');
});
// router.get('/notes',async (req, res) => {

//    const notes= await Note.find();
//    res.render('notes/all-notes',{notes});



// });
module.exports = router;