import './charInfo.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMsg from "../errorMsg/errorMsg";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import PropTypes from 'prop-types';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelServices = new MarvelService();

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps) {
        if (this.props.onCharId !== prevProps.onCharId) {
            this.updateChar()
        }
    }

    updateChar = () => {
        const {onCharId} = this.props;
        if(!onCharId) {
            return;
        }
        this.onCharLoading()
        this.marvelServices
            .getOneCharacter(onCharId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    render() {

        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMsg = error ? <ErrorMsg/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMsg}
                {spinner}
                {content}
            </div>
        )
    }

}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics'}
                {
                    comics.map((item, i) => {
                        if (i > 10) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    onCharId: PropTypes.number
}

export default CharInfo;