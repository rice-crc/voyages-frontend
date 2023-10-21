import '@/style/homepage.scss';
import FOOTER from '@/assets/footerimg.svg'
export const FooterComponent = () => {

    return (
        <div id="footer-bg">
            <img src={FOOTER} alt='footer' />
        </div>
    )
}