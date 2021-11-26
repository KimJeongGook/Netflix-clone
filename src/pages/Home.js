import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Movie, Loading, Input, Button, Menu, Modal } from "components";
import './Home.css'

const Home = () =>{
    //모달창
    const [open, setOpen] = useState(false)
    //(제일 위쪽) 사용자 정보 유뮤에 따른 페이지 접근 제한하기 
    const navigateToRegister = useNavigate()
    const user = JSON.parse(sessionStorage.getItem('user'))

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = () => {
        setOpen(false)
        // alert("Sorry ! You need to register first !")
        navigateToRegister('/')
    }
    if(!user){
        useEffect( ()=>{
        //     alert("Sorry ! You need to register first !")
        //     //이페이지에 접근권한이 없습니다.
        //     navigateToRegister('/') //로그인 화면으로 이동
            openModal()
        })
        return <>
            {/* 모달창 */}
            <Modal open={open}>
                <div className="header">-- Warning message --</div>
                <div className="body">
                    "Sorry ! You need to register first !"
                </div>
                <div className="footer">
                    <Button size="small" handleClick={closeModal}>Close</Button>
                </div>
            </Modal>
        </>
    }

    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState([])
    //검색 키워드를 업데이트하기 위하여 리액트 훅을 사용
    const [ query, setQuery] = useState('')
    //정렬 버튼 클릭에 따라 isSorted 상태를 토글시키기 위하여 리액트 훅을 사용
    const [isSorted, setIsSorted] = useState(-1)
    //홈 화면에 영화목록 전체보기 기능 만들기
    const [limit, setLimet] = useState(6)
    //홈화면에서 추천 페이지로 이동하기
    const navigate = useNavigate()

    //세션스토리지에서 종아요 정보를 조회하기
    const likes = JSON.parse(sessionStorage.getItem('likes')) || {}
    console.log(likes)

    useEffect( ()=> {
        fetch('https://yts.mx/api/v2/list_movies.json?limit=12')
        .then(res => res.json())
        .then(result =>{
            const {data:{movies}} = result
            console.log(movies)
            setLoading(false)
            setMovies(movies)
        })
    }, [])

    // 사용자가 입력한 키워드로 입력창 화면을 설정하기 위하여 리액트 훅을 사용
    const handleChange = (e) =>{
        const {value} = e.target
        setQuery(value)
    }
    //정렬 버튼을 클릭할때마다 isSorted 상태가 -1 에서 1로 바뀌거나 1 에서 -1 로 바뀐다.
    const sortByYear = (e) => {
        setIsSorted(isSorted * -1)
    }
    //사용자가 클릭한 해당 영화에 대한 좋아요 숫자 업데이트하기
    const updadeLikes = (id) =>{
        const likes = JSON.parse(sessionStorage.getItem('likes'))||{}
        if(likes[id] === null || likes[id] === undefined){
            likes[id] = 0
        }
        likes[id] += 1
        sessionStorage.setItem('likes', JSON.stringify(likes))
    }
    //영화 삭제 
    const handleRemove = (id) =>{
        const moviesFiltered = movies.filter(movie => movie.id !== id)
        setMovies(moviesFiltered)
        //likes 리스트에서도 해당 영화에 대한 좋아요 정보 제거
        const likes = JSON.parse(sessionStorage.getItem('likes')) || {}
        delete likes[id]
        sessionStorage.setItem('likes', JSON.stringify(likes))
     }
     //영화 전체목록 보기
     const displayEntireMovies = () =>{
         console.log('display all movies !')
         setLimet(movies.length)
     }

    const homeUI = movies
    //사용자가 입력한 키워드가 영화 제목이나 장르에 포함되어 있으면 해당 영화들만 필터링해서 보여줌
                        .filter(movie => {
                            const title = movie.title.toLowerCase()
                            const genres = movie.genres.join(' ').toLowerCase()
                            const q = query.toLowerCase()
                            return title.includes(q) || genres.includes(q)
                        }) 
                        .sort((a,b) => {
                            return (b.year - a.year)* isSorted;
                        })
                        .slice(0, limit)
                        .map(movie => 
                            <div className='movie-item' key={movie.id}>
                                <div className='movie-delete' onClick={(e) =>
                                handleRemove(movie.id)}>X</div>
                                <Link
                                    to='/detail'
                                    state={{movie}}
                                    style={{textDecoration: 'none', color:'white'}}
                                    onClick={() => updadeLikes(movie.id)}
                                    >
                                <Movie
                                    key={movie.id}
                                    title={movie.title}
                                    genres={movie.genres}
                                    cover={movie.medium_cover_image}
                                    summary={movie.summary}
// 배열 요소들이 객체로 이루어진 경우 위와 같이 sort 메서드를 사용하여 정렬할 수 있다.
// isSorted 상태가 토글되므로 최신순, 과거순으로 정렬이 된다. 
// 정렬을 위하여 무비 데이터의 year 프로퍼티를 사용하였다.         
                                    year={movie.year}
                                    rating={movie.rating}
                                    likes={likes[movie.id]}
                                    />
                                </Link>
                            </div>
                        )
    const toRankPage = () => {
        navigate('/recommend', {state: {movies}})
    }
    return (
        <>
        {loading? <Loading/> : <div className='Home-container'>
                <Menu>
                    <Button handleClick={toRankPage}>Rank</Button>
                </Menu>
                <div className='Home-entire'>
                    <Button handleClick={displayEntireMovies}>See Entire Movies</Button>
                </div>
                <div className='Home-contents'>
                    {/* 영화를 검색하기 위하여 Input 컴포넌트를 사용 */}
                    <Input name='search' type='text' placeholder='Search movies ...'
                        value={query} onChange={handleChange}/>
                    {/* 정렬 버튼을 추가 */}
                    <Button handleClick={sortByYear}>정렬</Button>
                    <div className='Home-movies'>{homeUI}</div>
                </div>
            </div>}
        </>
    )
}
export default Home;