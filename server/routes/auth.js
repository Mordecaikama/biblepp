import express from 'express'

const router = express.Router()

// controllers
const {
  allBooks,
  bookChapterWithVerses,
  bookWithAllChapters,
  allTranslations,
  bookChapterWithVersesAndTranslations,
} = require('../controllers/auth')

router.get('/all-books', allBooks)
router.get('/all-translations', allTranslations)
router.post('/all-chapters', bookChapterWithVerses)
router.post('/book-all-chapters', bookWithAllChapters)
router.post(
  '/book-all-chapters-translations',
  bookChapterWithVersesAndTranslations
)

// router.param('bookId', bookById)
// router.param('chapterId', chapterById)

export default router
