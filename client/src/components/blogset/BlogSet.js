import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactSpinner } from 'react-spinning-wheel';
import 'react-spinning-wheel/dist/style.css';
import {Link} from 'react-router-dom';
import classes from './css/BlogSet.module.css';
import ReactPaginate from "react-paginate";
import BlogSetItem from './BlogSetItem.js';
import getAxiosRequest from '../../util/getAxiosRequest';

const PER_PAGE = 12;

const BlogSet = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      if (props.time === "latest") {
        let query="";
        if(params.category){
          query = query + "category=" + params.category +"&";
        }
        if(props.limit){
          query = query + "limit=" + props.limit +"&";
        }
        if(query){
          const res = await getAxiosRequest("blogs/?"+ query);
          setBlogs(res.data);
        }
        else{
          const res = await getAxiosRequest("blogs/");
          setBlogs(res.data);
        }
      }
      setIsLoading(false);
    }
    if(isMounted)
    fetchBlogs();

    return () => { isMounted = false };
    
  }, [props.time, props.type, params.category, props.limit]);
  
  let currentPageData,pageCount,reactPaginate;

  if(isLoading){
    return (<div>
      <ReactSpinner />
    </div>
    );
  }
  else if (blogs.length === 0) {
    currentPageData = <p>No Posts found</p>
    reactPaginate = undefined;
  }
  else {
    pageCount = Math.ceil(blogs.length / PER_PAGE);
    const offset = currentPage * PER_PAGE;
    currentPageData = blogs.slice(offset, offset + PER_PAGE).map((post,index) => <BlogSetItem key={index} id={post._id} idTitle={post.idTitle} title={post.title} description={post.description} date={post.buildDate}
    category={post.category} isDetailed = {post.isDetailed} coverImage={post.coverImage} imageAlt={post.imageAlt} difficultyType={post.difficultyType}/>);

    if(blogs.length < PER_PAGE){
      reactPaginate = undefined;
    }
    else{
      reactPaginate = <ReactPaginate previousLabel={"Previous"} nextLabel={"Next"} pageCount={pageCount} onPageChange={handlePageClick} containerClassName={classes.pagination} previousLinkClassName={classes.pagination__link}
      nextLinkClassName={classes.pagination__link} disabledClassName={classes.pagination__link__disabled} activeClassName={classes.pagination__link__active}/>
    }
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
    window.scrollTo(0, 0);
  }

 

  return (
    <div className={classes.blogSetWrapper}>
      <div className={`${classes.blogSetTitle} title`}><h3><Link to={"/blogs"}><span className={classes.arrow}>{props.title} </span></Link></h3></div>
      <div className={classes.blogSetCollection}>
        {currentPageData}
      </div>
      {reactPaginate}
    </div>
  );
};

export default BlogSet;