import HeaderLogoSearch from '@/components/NavigationComponents/Header/HeaderSearchLogo';
import '@/style/about.scss';

const AboutComponent = () => {
    return (
        <>
            <HeaderLogoSearch />
            <div id="center-content-inner" className='about-container'>
                <div className="about-page-title-1 ">About the Project</div>
                <p>
                    The Trans-Atlantic and Intra-American slave trade databases are the
                    culmination of several decades of independent and collaborative
                    research by scholars drawing upon data in libraries and archives
                    around the Atlantic world. The new SlaveVoyages website itself is the
                    product of three years of development by a multi-disciplinary team of
                    historians, librarians, curriculum specialists, cartographers,
                    computer programmers, and web designers, in consultation with scholars
                    of the slave trade from universities in Europe, Africa, South America,
                    and North America. The National Endowment for the Humanities was the
                    principal sponsor of this work carried out originally at Emory Center
                    for Digital Scholarship, the University of California at Irvine, and
                    the University of California at Santa Cruz. The Hutchins Center of
                    Harvard University has also provided support. The website is currently
                    hosted at Rice University.
                </p>
                <div className="about-page-title-2">Questions or Comments</div>
                <p>
                    Please address all questions and comments regarding the content,
                    appearance, and functioning of this website as well as questions about
                    contributing new data to the{' '}
                    <a href="mailto:svopcom@googlegroups.com">
                        {' '}
                        SlaveVoyages Operational Committee
                    </a>
                    .
                </p>
            </div>
        </>
    );
};
export default AboutComponent;
