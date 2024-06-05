import { useState, useEffect } from 'react';
import './App.css';
import { ArrowForwardIos } from '@mui/icons-material';
import Loader from './components/Loader';
import axios from 'axios';
import toast from 'react-hot-toast';

function App() {
  const [prompt, setPrompt] = useState('');
  const [pass, setPass] = useState(true);
  const [box, setBox] = useState(true);
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState('');
  const [successFull, setSuccessFull] = useState(false)

  useEffect(() => {
    fetchArticles();
  }, [message]);

  // Function to fetch articles from the server
  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/articles');
      setArticles(res.data.slice(0, 5));
      if (res.data.length === 0 && successFull) {
        toast.error("No articles found");
      }
    } catch (error) {

      console.error('Error fetching articles:', error);
    }
  };

  // // Function to handle form submission and initiate scraping process
  const handlePage = async (e) => {
    e.preventDefault();
    // If prompt is not given then show error message
    if (prompt === '') {
      toast.error("Enter your Topic");
      return;
    }
    setPass(false);
    setBox(false);
    try {
      // Send post request to server for scraping
      const res = await axios.post('http://localhost:3001/scrape', { topic: prompt });
      setMessage(res?.data.message)
      if (res.data.message === 'Scraping successful') {
        await fetchArticles(); // After scraping, fetch updated articles
        setSuccessFull(true)
      }
      setPass(true);
    } catch (error) {
      console.error('Error scraping articles:', error);
      toast.error("No Articles Found");
      setPass(true);
    }
  };

  // Function to handle selection of predefined topics
  const handleDummyData = (name) => {
    setPrompt(name);
    setBox(false);
  };

  const Dummy = [
    { title: 'Technology' },
    { title: 'Sports' },
    { title: 'Health' },
    { title: 'Entertainment' },
  ];

  return (
    <>
      <div className="w-full h-[10vh]"></div>
      <section className='h-screen w-full relative'>
        <div className="h-auto min-h-[24%] flex flex-col items-center justify-center relative p-4 md:p-8 gap-4">
          <h3 className="poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-center">
            <span className='textColorBg'>
              Medium Article Scraper and Viewer
            </span>
          </h3>
          <p className="poppins text-sm sm:text-base md:text-[1rem] lg:text-[1rem] w-full flex-colm sm:w-[90%] md:w-[80%] lg:w-[70%] text-center lg:leading-9 md:leading-8 sm:leading-8 mt-4 leadingHeight space-y-4">
            Effortlessly streamline your Medium reading experience. Access articles with ease and efficiency.
            Simplify content extraction and viewing. Enjoy a seamless interface for consuming your favorite Medium posts.
          </p>
        </div>
        <form className="w-full h-auto flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" method="post" onSubmit={handlePage}>
          <div className="relative rounded-lg w-full sm:w-[80%] md:w-[60%] lg:w-[35%] overflow-hidden before:absolute before:w-12 before:h-12 before:content-[''] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:-z-10 after:w-20 after:h-20 after:content-[''] after:bg-rose-300 after:right-12 after:top-3 after:rounded-full after:blur-lg">
            <input
              placeholder="Enter your topic"
              className="relative pr-20 bg-transparent ring-0 outline-none border border-neutral-500 text-white placeholder-white text-sm rounded-lg focus:ring-violet-500 placeholder-opacity-60 focus:border-violet-500 block w-full p-2.5 poppins"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1 text-2xl text-white cursor-pointer">
              <ArrowForwardIos />
            </button>
          </div>
        </form>

        <div className={`min-h-[50%] flex flex-wrap items-center justify-evenly  ${box ? "responsive" : "nonres"}`}>
          {!pass ? (
            <Loader />
          ) : (

            articles.map((article, index) => (
              <a key={index} href={article.url} className="m-4 p-4 border rounded-md shadow-md max-w-sm cursor-pointer" target='blank'>
                <img src={article.img} alt={article.title} className="w-full h-auto rounded-md" />
                <h3 className="text-lg font-semibold mt-3 poppins ">{article.title}</h3>
                <p className="text-sm text-gray-600 poppins mt-2">{article.date}</p>
                <p className="text-sm text-gray-600 poppins mt-2">{article.publisher}</p>
              </a>
            ))
          )}
          {(box) && (
            <div className="w-full sm:w-[90%] min-h-[15em] flex items-center justify-evenly flex-wrap -mt-20">
              {Dummy?.map((t, index) => (
                <div
                  className="border cursor-pointer border-rose-300 w-full sm:w-[48%] md:w-[30%] lg:w-[20%] rounded-lg h-[5em] flex items-center justify-center p-3 leading-7 hover:-translate-y-2 transition-all ease-in-out mb-4"
                  key={index}
                  onClick={() => { handleDummyData(t.title) }}
                >
                  <p className="poppins">{t ? t.title : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
