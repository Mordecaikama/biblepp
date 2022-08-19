import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Dropdown from '../component/dropdown'
import Mainpage from '../component/mainpage'
import { Context } from '../context'

function Home() {
  const [loading, setLoading] = useState(false)
  const [appdata, setAppdata] = useState(null)
  const [active, setActive] = useState({
    new: false,
    old: false,
  })
  const [bookChapter, setBookChapter] = useState(null)
  const [book, setBook] = useState(null)
  const [chapter, setChapter] = useState(1)
  const [chapters, setChapters] = useState(null)
  const [translations, setTranslations] = useState(null)
  const [translation, setTranslation] = useState('KJV')
  const { isAuthenticated, AddTolocalStorage } = useContext(Context)
  const [menuShow, setMenuShow] = useState(false)
  // console.log(book && book)

  useEffect(() => {
    loadBibleData()
    allTranslations()
    loadFromStorage()
  }, [])

  const loadFromStorage = () => {
    const data = isAuthenticated()
    const transl = isAuthenticated('translation')
    if (data) {
      setChapter(data[0].chapterId)
      setBook(data[0])
    }
    if (transl) {
      setTranslation(transl)
    }
  }

  const loadMainpageDefault = (data) => {
    // this loads default mainpage for first time wen no one has used the app
    const diskdata = isAuthenticated()
    !diskdata && handleChapters(data[0])
  }

  const loadBibleData = async () => {
    // this data is loaded into the sidebar

    setLoading(true)
    const { data } = await axios.get(`/all-books`)
    if (data) {
      setAppdata(data)
      setLoading(false)
      loadMainpageDefault(data) // this loads default data if app have not been used before
      // console.log(data[0])
    }
  }

  const handleChapters = async (book) => {
    // this fetches data based on the book e.g Mathew
    // with all chapters and verse

    const { data } = await axios.post(`/all-chapters`, {
      bookid: book.id,
      chapterid: 1, // default or localstorage
    })
    if (data) {
      // console.log(data)
      setBookChapter(data)
      setChapter(1)
      setBook(data[0])
      allChapters(book)
      AddTolocalStorage(data)
    }
  }

  const handleChapter = (name) => async (event) => {
    // this fetches data when chapterId changes
    setChapter(event.target.value)
    // this sets the chapternumber

    // setLoading(true)
    const { data } = await axios.post(`/all-chapters`, {
      bookid: book.book.id,
      chapterid: event.target.value, // default or localstorage
    })
    if (data) {
      // console.log(data)
      setBookChapter(data)
      AddTolocalStorage(data)
      setBook(data[0])
    }
  }

  const allChapters = async (book) => {
    const { data } = await axios.post(`/book-all-chapters`, {
      bookid: book.id,
    })
    if (data) {
      setChapters(data.length)
    }
  }

  const allTranslations = async () => {
    // setLoading(true)
    const { data } = await axios.get(`/all-translations`)
    if (data) {
      setTranslations(data)
    }
  }

  const handleTranslationChange = (name) => async (event) => {
    const val = event.target.value
    setTranslation(val)
    AddTolocalStorage('translation', event.target.value)
    const { data } = await axios.post(`/book-all-chapters-translations`, {
      bookid: book.book.id,
      chapterid: book.chapterId, // default or localstorage
      abbreviation: event.target.value,
    })
    if (data) {
      console.log(data)
      setBookChapter(data)
      AddTolocalStorage(data)
      setBook(data[0])
    }
  }

  const handleSidebar = () => {
    console.log('sidebar clicked')
  }

  return (
    <div>
      <nav>
        <div className='container nav__container'>
          <div className='logo'>
            <i className='fal fa-acorn'></i>
          </div>

          <div className='middle'>
            <div className='top'>
              {book && (
                <h2 className='btn btn-variant-text'>
                  {book && book.book && book.book.name}
                </h2>
              )}
              <p>Chapter</p>
              <select value={chapter} onChange={handleChapter('chapter')}>
                <option value={chapter}>{chapter}</option>
                {chapters &&
                  [...Array(chapters).keys()].map((c, i) => {
                    const cut = c + 1
                    return (
                      <option key={i} value={cut}>
                        {cut}
                      </option>
                    )
                  })}
              </select>
              <div
                className='select'
                value={translation && translation}
                onChange={handleTranslationChange('translation')}
              >
                <select name='standard-select'>
                  <option value={translations}>{translation}</option>
                  {translations &&
                    translations.map((item, ind) => {
                      return (
                        <option value={item.abbreviation}>
                          {item.abbreviation}
                        </option>
                      )
                    })}
                </select>
                <span className='focus'></span>
              </div>
            </div>
          </div>

          <div className='right'>
            <span
              className='material-icons-sharp'
              onClick={() => setMenuShow(!menuShow)}
            >
              menu
            </span>
          </div>
        </div>
      </nav>
      {/* <button onClick={() => loadBible()}>press</button> */}
      {/* <div>{appdata && JSON.stringify(appdata)}</div> */}

      <div className='container main__container'>
        <aside className={`${menuShow && 'menushow'}`}>
          <div className='top'>
            <div className='logo'>
              <h4>Holy Bible</h4>
            </div>
            <span
              className='material-icons-sharp close'
              onClick={() => setMenuShow(!menuShow)}
            >
              close
            </span>
          </div>
          <div className='sidebar'>
            <a
              href='#'
              className={`side-header ${active.old && 'active'}`}
              onClick={() => setActive({ ...active, old: !active.old })}
            >
              <span className='material-icons-sharp'>library_books</span>
              <h3>Old Testament</h3>
              <span className='material-icons-sharp'>keyboard_return</span>
            </a>
            {active && active.old && (
              <Dropdown
                data={appdata}
                testament='OT'
                handleClick={handleChapters}
              />
            )}
            <a
              href='#'
              className={`side-header ${active.new && 'active'}`}
              onClick={() => {
                setActive({ ...active, new: !active.new })
              }}
            >
              <span className='material-icons-sharp'>library_books</span>
              <h3>New Testament</h3>
              <span className='material-icons-sharp'>keyboard_return</span>
            </a>
            {active && active.new && (
              <Dropdown
                data={appdata}
                testament='NT'
                handleClick={handleChapters}
              />
            )}
          </div>
        </aside>
        <main>
          <Mainpage data={bookChapter} />
        </main>
      </div>
    </div>
  )
}

export default Home
