
import '@/style/landing.scss';
import { Link } from 'react-router-dom';
import { Interface } from 'readline';
interface ListBtnItem {
    name: string
    url: string
}
interface ButtonListsProps {
    lists: ListBtnItem[]
}

const ButtonLists: React.FC<ButtonListsProps> = ({ lists }) => {
    console.log({ lists })

    return (
        <div className="list-btn">
            {lists.map((list) => (
                <div key={`${list.name}-${list.url}`}>
                    <Link
                        to={list.url}
                        style={{ textDecoration: 'none' }}
                    // onClick={onChangePath}
                    ><div className='btn-list-name'>{list.name}</div></Link > </div>

            ))}
        </div>
    )
}
export default ButtonLists