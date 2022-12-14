const express = require('express')
//const Article = require('../models/article')
const router = express.Router()

router.get('/',(req,res)=>{
    //console.log(__direname)
    res.render("index", {titulo:"mi titulo dinámico"})
})

router.get('/servicios',(req, res)=>{
    res.render("servicios",{
        tituloServicio:"Este es un mensaje dinamico"
    })
})



router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()})
})

// Obtenemos el Articulo con Slug aplicado
router.get('/:slug', async(req, res)=>{
    const article = await Article.findOne({slug: req.params.slug})
    if(article == null) res.redirect('/')
    res.render('articles/show', {article: article})
})

// Creamos Nuevo Articulo
router.post('/', async(req, res, next)=>{
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

// Editamos Articulo x ID
router.put('/:id', async(req, res, next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))



// Guardar Articulo y redireccionar
function saveArticleAndRedirect(path){
    return async(req, res)=>{
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch(e){
            res.render(`articles/${path}`, {article: article})
        }
    }
}

app.use('/', require('./router/articles'));
app.use('/mascotas', require('./router/articles'));


module.exports = router;
