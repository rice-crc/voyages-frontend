
import '@/style/landing.scss';
interface ButtonListsProps {
    lists: string[]
}

const ButtonLists: React.FC<ButtonListsProps> = ({ lists }) => {

    return (
        <div className="list-btn">
            {lists.map(list => (
                <div key={list}>{list}</div>
            ))}
        </div>
    )
}
export default ButtonLists