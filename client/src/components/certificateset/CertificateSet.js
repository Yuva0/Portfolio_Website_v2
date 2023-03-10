import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactSpinner } from 'react-spinning-wheel';
import 'react-spinning-wheel/dist/style.css';
import classes from './css/CertificateSet.module.css';
import {Link} from 'react-router-dom';
import CertificateSetItem from './CertificateSetItem.js';
import getAxiosRequest from '../../util/getAxiosRequest';
import ReactPaginate from "react-paginate";

const PER_PAGE = 20;

const CertificateSet = (props) => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
    
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (props.time === "latest") {
        let query="";
        if(params.category){
          query = query + "category=" + params.category +"&";
        }
        if(props.limit){
          query = query + "limit=" + props.limit +"&";
        }
        if(query){
          const res = await getAxiosRequest("certificates/?"+ query);
          setCertificates(res.data);
        }
        else{
          const res = await getAxiosRequest("certificates/");
          setCertificates(res.data);
        }
        setIsLoading(false);
      }
    }

    fetchCertificate();
  }, [props.time, props.type, params.category, props.limit]);
  
  let currentPageData,pageCount,reactPaginate;

  if(isLoading){
    return (<div>
      <ReactSpinner />
    </div>
    );
  }
  else if (certificates.length === 0) {
    currentPageData = <p>No Certificates found</p>
    reactPaginate = undefined;
  }
  else {
    pageCount = Math.ceil(certificates.length / PER_PAGE);
    const offset = currentPage * PER_PAGE;
    currentPageData = certificates.slice(offset, offset + PER_PAGE).map((certificate,index) => <CertificateSetItem key={certificate._id} id={certificate._id} idTitle={certificate.idTitle} title={certificate.title} description={certificate.description} date={certificate.createdAt}
      category={certificate.category} isDetailed = {certificate.isDetailed} coverImage={certificate.coverImage} imageAlt={certificate.imageAlt} duration={certificate.duration} difficultyType={certificate.difficultyType}/>
    );

    if(certificates.length < PER_PAGE){
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
    <div className={classes.certificateSetWrapper}>
      <div className={`${classes.certificateSetTitle} title`}><h3><Link to={"/certificates"}><span className={classes.arrow}>{props.title} </span></Link></h3></div>
      <div className={classes.certificateSetCollection}>
        {currentPageData}
      </div>
      {reactPaginate}
    </div>
  );
};

export default CertificateSet;