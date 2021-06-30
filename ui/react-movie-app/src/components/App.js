import React, { useReducer, useEffect } from "react";
import { forwardRef } from 'react';
import "../App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <SearchIcon {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };


const API_KEY = "65525897";

const MOVIE_API_URL = `https://www.omdbapi.com/?s=man&apikey=${API_KEY}`;

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};


const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {
    
        dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
      });
    });
  }, []);

  const searchUser = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.Response === "True") {
        dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
        });
      } else {
        dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
        });
      }
    });
  };

  const search = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.Response === "True") {
        dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
        });
      } else {
        dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
        });
      }
    });
  };

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <div className="Nav">
        <Header text="ÖNERİ SİSTEMLERİ FİNAL PROJESİ" />
        <Search search={searchUser} placeholder="Kullanıcı Değiştir" buttonValue="TAMAM"/>
      </div>
      <div style={{ maxWidth: "100%" }} className="user-table">
        <MaterialTable
        icons={tableIcons}
          columns={[
            { title: "Film Adı", field: "filmName" },
            { title: "Kullanıcının Puanı", field: "raiting", type: "numeric" },
          ]}
          data={[
            {
              filmName: "The Matrix",
              raiting: 5.8,
            },
          ]}
          title="Kullanıcı Bilgileri"
        />
      </div>
      <p className="App-intro">Kullanıcıya önerilen filmler</p>
      <div className="film-search-box">
      <Search search={search} placeholder="Film Ara..." buttonValue="ARA"/>
      </div>
      
      <div className="movies">
        {loading && !errorMessage ? (
          <span className="loader"></span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;