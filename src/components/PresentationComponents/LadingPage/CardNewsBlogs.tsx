import { BASEURL } from '@/share/AUTH_BASEURL';
import defaultImage from '@/assets/no-imge-default.avif';
import '@/style/landing.scss';
import { Link } from 'react-router-dom';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { formatTextURL } from '@/utils/functions/formatText';
interface CardProps {
    thumbnail: string,
    title: string
    id: number
}

export const CardNewsBlogs = (props: CardProps) => {
    const { thumbnail, title, id } = props
    return (
        <li className="card">
            <Link to={`/${BLOGPAGE}/${formatTextURL(title)}/${id}`}>
                {thumbnail ?
                    <span> <img
                        src={`${BASEURL}${props.thumbnail}`}
                        alt={props.title}
                        className="content-image-slide"
                    />
                        <p>{title}</p></span>
                    :
                    <span>  <img
                        src={defaultImage}
                        alt={title}
                        style={{ textAlign: 'center', width: '100%' }}
                        className="content-image-slide"
                    />
                        <p>{title}</p>
                    </span>

                }
            </Link>
        </li>
    )
}
