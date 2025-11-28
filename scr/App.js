import React, { useState, useEffect } from 'react';
import './App.css';

const MovieWatchlist = () => {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Загрузка фильмов из localStorage при запуске
    useEffect(() => {
        const savedMovies = localStorage.getItem('movieWatchlist');
        if (savedMovies) {
            setMovies(JSON.parse(savedMovies));
        }
    }, []);

    // Сохранение фильмов в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('movieWatchlist', JSON.stringify(movies));
    }, [movies]);

    const addMovie = () => {
        if (title.trim() === '') return;

        const newMovie = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            status: 'wantToWatch',
            addedDate: new Date().toLocaleDateString()
        };

        setMovies([newMovie, ...movies]);
        setTitle('');
        setDescription('');
    };

    const toggleMovieStatus = (id) => {
        setMovies(movies.map(movie =>
            movie.id === id
                ? {
                    ...movie,
                    status: movie.status === 'wantToWatch' ? 'watched' : 'wantToWatch',
                    watchedDate: movie.status === 'wantToWatch' ? new Date().toLocaleDateString() : undefined
                }
                : movie
        ));
    };

    const deleteMovie = (id) => {
        setMovies(movies.filter(movie => movie.id !== id));
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const wantToWatchMovies = filteredMovies.filter(movie => movie.status === 'wantToWatch');
    const watchedMovies = filteredMovies.filter(movie => movie.status === 'watched');

    return (
        <div className="app">
            <header className="app-header">
                <h1>Мой список фильмов</h1>
                <p>Отслеживайте фильмы, которые хотите посмотреть и уже посмотрели</p>
            </header>

            <div className="container">
                {/* Форма добавления фильма */}
                <div className="add-movie-section">
                    <h2>Добавить новый фильм</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Название фильма *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addMovie()}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Описание (необязательно)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addMovie()}
                            className="input-field"
                        />
                        <button
                            onClick={addMovie}
                            disabled={!title.trim()}
                            className="add-button"
                        >
                            Добавить в список
                        </button>
                    </div>
                </div>

                {/* Поиск */}
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Поиск фильмов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Статистика */}
                <div className="stats">
                    <div className="stat-card">
                        <h3>Всего фильмов</h3>
                        <span className="stat-number">{movies.length}</span>
                    </div>
                    <div className="stat-card">
                        <h3>Хочу посмотреть</h3>
                        <span className="stat-number want-to-watch">{wantToWatchMovies.length}</span>
                    </div>
                    <div className="stat-card">
                        <h3>Просмотрено</h3>
                        <span className="stat-number watched">{watchedMovies.length}</span>
                    </div>
                </div>

                {/* Списки фильмов */}
                <div className="movies-layout">
                    {/* Хочу посмотреть */}
                    <div className="movie-column">
                        <h2 className="column-title want-to-watch-title">
                            Хочу посмотреть ({wantToWatchMovies.length})
                        </h2>
                        {wantToWatchMovies.length === 0 ? (
                            <div className="empty-state">
                                <p>Нет фильмов для просмотра</p>
                                <small>Добавьте фильмы, которые планируете посмотреть</small>
                            </div>
                        ) : (
                            wantToWatchMovies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    onToggleStatus={toggleMovieStatus}
                                    onDelete={deleteMovie}
                                />
                            ))
                        )}
                    </div>

                    {/* Просмотрено */}
                    <div className="movie-column">
                        <h2 className="column-title watched-title">
                            Просмотрено ({watchedMovies.length})
                        </h2>
                        {watchedMovies.length === 0 ? (
                            <div className="empty-state">
                                <p>Нет просмотренных фильмов</p>
                                <small>Отмечайте фильмы как просмотренные</small>
                            </div>
                        ) : (
                            watchedMovies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    onToggleStatus={toggleMovieStatus}
                                    onDelete={deleteMovie}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Компонент карточки фильма
const MovieCard = ({ movie, onToggleStatus, onDelete }) => {
    return (
        <div className={`movie-card ${movie.status}`}>
            <div className="movie-header">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-actions">
                    <button
                        onClick={() => onToggleStatus(movie.id)}
                        className={`status-button ${movie.status}`}
                        title={movie.status === 'wantToWatch' ? 'Отметить как просмотренное' : 'Вернуть в список желаемых'}
                    >
                        {movie.status === 'wantToWatch' ? 'Посмотрено' : 'Не смотрел'}
                    </button>
                    <button
                        onClick={() => onDelete(movie.id)}
                        className="delete-button"
                        title="Удалить фильм"
                    >
                        ×
                    </button>
                </div>
            </div>

            {movie.description && (
                <p className="movie-description">{movie.description}</p>
            )}

            <div className="movie-meta">
                <span className="meta-info">Добавлен: {movie.addedDate}</span>
                {movie.watchedDate && (
                    <span className="meta-info">Просмотрен: {movie.watchedDate}</span>
                )}
            </div>
        </div>
    );
};

export default MovieWatchlist;
