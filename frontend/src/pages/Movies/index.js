import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { search, categorize } from "../../utils";
import { Input, Loading, ListGroup } from "../../components/common";
import { MoviesTable, Pagination } from "../../components";


import { getMovies } from "../../actions/moviesAction";
import { getGenres } from "../../actions/genreAction";

const Movies = (props) => {
  const [pageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentGenre, setCurrentGenre] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    props.getMovies();
    props.getGenres();
  }, [props.loggedIn, props.getMovies, props.getGenres]);

  const handleChange = (name, value) => {
    if (name === "currentGenre") {
      setCurrentGenre(value);
    } else if (name === "searchFilter") {
      setSearchFilter(value);
    }
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const { movies, genres, loading } = props;
  const allGenres = [{ name: "All" }, ...genres];

  const filteredMovies = useMemo(() => {
  let result = search(movies, searchFilter, "title");
  result = categorize(result, currentGenre);
  return result;
}, [movies, searchFilter, currentGenre]);

  if (loading) {
    return (
      <div className="background-container pt-5">
        <Loading />
      </div>
    );
  }

  return (
    <div className="background-container">
      <div className="mx-5 py-5">
        <div className="row">
          <div className="col-lg-2 col-sm-12 mt-10">
            <h4 className="text-muted text-left p-1">Filters</h4>
            <ListGroup
              active={currentGenre}
              onChange={(val) => handleChange("currentGenre", val)}
              options={allGenres}
            />
        
          </div>

          <div className="col-lg-10 col-sm-12">
            <Input
              onChange={(event) =>
                handleChange("searchFilter", event.target.value)
              }
              label="Search Movie"
              iconClass="fas fa-search"
              placeholder="Search..."
            />
            <p className="text-left text-muted">
              {!!filteredMovies.length ? `${filteredMovies.length}` : "0"}
              movies found.
            </p>

            {!!filteredMovies ? (
              <MoviesTable
                pageSize={pageSize}
                currentPage={currentPage}
                movies={filteredMovies}
              />
            ) : (
              <h1 className="text-white">No Movies</h1>
            )}
            <br />

            <Pagination
              itemsCount={filteredMovies.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    movies: state.movie.movies,
    genres: state.genre.genres,
    loggedIn: state.auth.loggedIn,
    loading: state.movie.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMovies: () => dispatch(getMovies()),
    getGenres: () => dispatch(getGenres()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
